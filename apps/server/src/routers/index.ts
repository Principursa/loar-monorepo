import {
  protectedProcedure, publicProcedure,
  router,
} from "../lib/trpc";
import { readFileSync } from "fs";
import { join } from "path";
import { db } from "../db";
import { characters } from "../db/schema/characters";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { videoService } from "../services/video";
import { walrusService } from "../services/walrus";
import { klingService } from "../services/kling";

import { cinematicUniversesRouter } from "./cinematicUniverses/cinematicUniverses.index";


export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  cinematicUniverses: cinematicUniversesRouter,
  wiki: router({
    characters: publicProcedure.query(async () => {
      try {
        const result = await db.select().from(characters);
        return {
          metadata: {
            version: "5.0",
            created_at: new Date().toISOString(),
            total_characters: result.length,
            last_updated: new Date().toISOString()
          },
          characters: result.map(char => ({
            id: char.id,
            character_name: char.character_name,
            collection: char.collection,
            token_id: char.token_id,
            traits: char.traits as Record<string, string>,
            rarity_rank: char.rarity_rank,
            rarity_percentage: char.rarity_percentage ? parseFloat(char.rarity_percentage) : 0,
            image_url: char.image_url,
            description: char.description,
            created_at: char.created_at.toISOString()
          }))
        };
      } catch (error) {
        console.error("Failed to load characters from database:", error);
        // Fallback to JSON file if database fails
        try {
          const wikiPath = join(process.cwd(), "../character-wiki/simple_character_wiki.json");
          const wikiData = readFileSync(wikiPath, "utf-8");
          return JSON.parse(wikiData);
        } catch (fileError) {
          console.error("Failed to load character wiki file:", fileError);
          throw new Error("Could not load character data");
        }
      }
    }),
    character: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          const result = await db.select().from(characters).where(eq(characters.id, input.id));
          if (result.length === 0) {
            throw new Error("Character not found");
          }
          
          const char = result[0];
          return {
            id: char.id,
            character_name: char.character_name,
            collection: char.collection,
            token_id: char.token_id,
            traits: char.traits as Record<string, string>,
            rarity_rank: char.rarity_rank,
            rarity_percentage: char.rarity_percentage ? parseFloat(char.rarity_percentage) : 0,
            image_url: char.image_url,
            description: char.description,
            created_at: char.created_at.toISOString()
          };
        } catch (error) {
          console.error("Failed to load character from database:", error);
          throw new Error("Could not load character");
        }
      }),
  }),
  video: router({
    generate: publicProcedure
      .input(z.object({
        prompt: z.string().min(1, "Prompt is required"),
        model: z.enum(['ray-flash-2', 'ray-2', 'ray-1-6']).optional(),
        resolution: z.enum(['540p', '720p', '1080p', '4k']).optional(),
        duration: z.enum(['5s', '10s']).optional(),
        imageUrl: z.string().url().optional() // For image-to-video generation
      }))
      .mutation(async ({ input }) => {
        return await videoService.generateVideo(input);
      }),
    status: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await videoService.getGenerationStatus(input.id);
      }),
    generateAndWait: publicProcedure
      .input(z.object({
        prompt: z.string().min(1, "Prompt is required"),
        model: z.enum(['ray-flash-2', 'ray-2', 'ray-1-6']).optional(),
        resolution: z.enum(['540p', '720p', '1080p', '4k']).optional(),
        duration: z.enum(['5s', '10s']).optional(),
        imageUrl: z.string().url().optional() // For image-to-video generation
      }))
      .mutation(async ({ input }) => {
        const generation = await videoService.generateVideo(input);
        return await videoService.waitForCompletion(generation.id);
      }),
    multiImageGenerate: publicProcedure
      .input(z.object({
        image_list: z.array(z.object({
          image: z.string().min(1, "Image is required")
        })).min(1, "At least one image is required").max(4, "Maximum 4 images allowed"),
        prompt: z.string().optional(),
        negative_prompt: z.string().optional(),
        mode: z.enum(['std', 'pro']).optional(),
        duration: z.enum(['5', '10']).optional(),
        aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional(),
        external_task_id: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        return await klingService.createMultiImageVideo(input);
      }),
    multiImageStatus: publicProcedure
      .input(z.object({ task_id: z.string() }))
      .query(async ({ input }) => {
        return await klingService.getTaskStatus(input.task_id);
      }),
    multiImageGenerateAndWait: publicProcedure
      .input(z.object({
        image_list: z.array(z.object({
          image: z.string().min(1, "Image is required")
        })).min(1, "At least one image is required").max(4, "Maximum 4 images allowed"),
        prompt: z.string().optional(),
        negative_prompt: z.string().optional(),
        mode: z.enum(['std', 'pro']).optional(),
        duration: z.enum(['5', '10']).optional(),
        aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional(),
        external_task_id: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        const generation = await klingService.createMultiImageVideo(input);
        return await klingService.waitForCompletion(generation.data.task_id);
      }),
    // Add provider selection for video generation
    generateWithProvider: publicProcedure
      .input(z.object({
        provider: z.enum(['lumaai', 'kling']),
        prompt: z.string().min(1, "Prompt is required"),
        model: z.enum(['ray-flash-2', 'ray-2', 'ray-1-6']).optional(),
        resolution: z.enum(['540p', '720p', '1080p', '4k']).optional(),
        duration: z.enum(['5s', '10s']).optional(),
        imageUrl: z.string().url().optional(), // For single image (LumaAI)
        imageUrls: z.array(z.string().url()).optional() // For multiple images (Kling)
      }))
      .mutation(async ({ input }) => {
        if (input.provider === 'lumaai') {
          // Use existing LumaAI service
          return await videoService.generateVideo({
            prompt: input.prompt,
            model: input.model,
            resolution: input.resolution,
            duration: input.duration,
            imageUrl: input.imageUrl
          });
        } else {
          // Use Kling service for multi-image
          const imageUrls = input.imageUrls && input.imageUrls.length > 0 
            ? input.imageUrls 
            : [input.imageUrl].filter(Boolean);
          
          console.log('Kling generation - Processing image URLs:', {
            inputImageUrls: input.imageUrls,
            inputImageUrl: input.imageUrl,
            finalImageUrls: imageUrls,
            imageCount: imageUrls.length
          });
          
          if (imageUrls.length === 0) {
            throw new Error('No image URLs provided for Kling generation');
          }
          
          const imageList = imageUrls.map(url => ({ 
            image: `https://images.weserv.nl/?url=${encodeURIComponent(url!)}` 
          }));
          
          console.log('Kling generation - Final image list:', imageList);
          
          const result = await klingService.createMultiImageVideo({
            image_list: imageList,
            prompt: input.prompt,
            mode: 'std', // Cheapest mode
            duration: '5', // Shortest duration
            aspect_ratio: '16:9'
          });
          
          return {
            id: result.data.task_id,
            status: result.data.task_status === 'submitted' ? 'pending' : 
                   result.data.task_status === 'processing' ? 'dreaming' : 
                   result.data.task_status === 'succeed' ? 'completed' : 'failed'
          };
        }
      }),
  }),
  walrus: router({
    uploadFromUrl: publicProcedure
      .input(z.object({
        url: z.string().min(1, "URL is required")
      }))
      .mutation(async ({ input }) => {
        try {
          console.log(`🌐 Walrus upload request for: ${input.url}`);
          const result = await walrusService.uploadFromUrl(input.url);
          console.log(`✅ Walrus upload success: ${result.blobId}`);
          return result;
        } catch (error) {
          console.error('❌ Walrus upload error:', error);
          throw error;
        }
      }),
    getBlobInfo: publicProcedure
      .input(z.object({ blobId: z.string() }))
      .query(async ({ input }) => {
        return await walrusService.getBlobInfo(input.blobId);
      }),
    getFileUrl: publicProcedure
      .input(z.object({ blobId: z.string() }))
      .query(({ input }) => {
        return { url: walrusService.getFileUrl(input.blobId) };
      }),
  }),
});
export type AppRouter = typeof appRouter;
