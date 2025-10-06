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

import { walrusService } from "../services/walrus";
import { falService } from "../services/fal";

import { cinematicUniversesRouter } from "./cinematicUniverses/cinematicUniverses.index";
import { falRouter } from "./fal/fal.routes";
import { synapseService } from "../services/synapse";


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
  fal: falRouter,
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
    // Use Fal AI service for video generation
    generateWithProvider: publicProcedure
      .input(z.object({
        provider: z.enum(['fal']),
        prompt: z.string().min(1, "Prompt is required"),
        duration: z.enum(['5s', '10s']).optional(),
        imageUrl: z.string().url().optional(),
      }))
      .mutation(async ({ input }) => {
        const duration = input.duration === '10s' ? 10 : 5;
        const result = await falService.generateVideo({
          prompt: input.prompt,
          imageUrl: input.imageUrl,
          duration,
          model: 'fal-ai/ltx-video'
        });

        return {
          id: result.id,
          status: result.status === 'completed' ? 'completed' :
                 result.status === 'in_progress' ? 'dreaming' :
                 result.status === 'failed' ? 'failed' : 'pending',
          videoUrl: result.videoUrl,
          failureReason: result.error
        };
      }),
  }),
  synapse: router({
    uploadFromUrl: publicProcedure
      .input(z.object({
        url: z.string().min(1, "URL is required")
      }))
      .mutation(async ({ input}) => {
        try {
          console.log(`Filecoin Synapse upload for ${input.url}`)
          const service = await synapseService;
          const result = await service.uploadFromUrl(input.url)
          console.log(`Filecoin Synapse successful - result type:`, typeof result)
          console.log(`Filecoin Synapse successful - result value:`, result)
          console.log(`Filecoin Synapse successful - stringified:`, JSON.stringify(result))
          return result;
        } catch (error) {
          console.error("Synapse upload error:", error)
          throw error
        }
      }),
    download: publicProcedure
      .input(z.object({ pieceCid: z.string() }))
      .query(async ({ input }) => {
        try {
          console.log(`Starting download for PieceCID: ${input.pieceCid}`);
          const service = await synapseService;
          
          console.log(`Service ready, attempting download...`);
          const data = await service.download(input.pieceCid);
          
          console.log(`Downloaded ${data.length} bytes for PieceCID: ${input.pieceCid}`);
          
          // Check if data is too large (> 5MB for tRPC transport safety)
          // Base64 encoding increases size by ~33%, so 5MB becomes ~6.7MB encoded
          if (data.length > 5 * 1024 * 1024) {
            console.error(`File too large for tRPC: ${Math.round(data.length / 1024 / 1024)}MB`);
            throw new Error(`File too large for tRPC: ${Math.round(data.length / 1024 / 1024)}MB (max 5MB). Use HTTP gateway instead.`);
          }
          
          try {
            console.log(`🔄 Converting ${data.length} bytes to base64...`);
            
            // Memory-safe base64 conversion with error handling
            const base64Data = Buffer.from(data).toString('base64');
            
            console.log(`✅ Base64 conversion successful, encoded length: ${base64Data.length}`);
            
            // Log memory usage after conversion
            const memUsage = process.memoryUsage();
            console.log(`📊 Memory after base64: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB heap`);
            
            return { 
              data: base64Data,
              pieceCid: input.pieceCid,
              originalSize: data.length,
              encodedSize: base64Data.length
            };
            
          } catch (base64Error) {
            console.error(`❌ Base64 conversion failed for ${input.pieceCid}:`, base64Error);
            throw new Error(`Base64 encoding failed: File too large for memory. Use HTTP gateway instead.`);
          }
        } catch (error) {
          console.error(`Failed to download PieceCID ${input.pieceCid}:`, error);
          throw new Error(`Failed to download from Filecoin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }),
    getHttpUrl: publicProcedure
      .input(z.object({ pieceCid: z.string() }))
      .query(({ input }) => {
        // Return an HTTP URL that can be used to access the Filecoin content
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://your-domain.com' 
          : 'http://localhost:3000';
        return { url: `${baseUrl}/api/filecoin/${input.pieceCid}` };
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
    uploadBase64: publicProcedure
      .input(z.object({
        base64Data: z.string().min(1, "Base64 data is required"),
        filename: z.string().optional().default("generated-image.png")
      }))
      .mutation(async ({ input }) => {
        try {
          console.log(`🌐 Walrus upload request for base64 data (${input.base64Data.length} chars)`);
          // Convert base64 to buffer
          const imageBuffer = Buffer.from(input.base64Data.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');
          const result = await walrusService.uploadFile(imageBuffer);
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
