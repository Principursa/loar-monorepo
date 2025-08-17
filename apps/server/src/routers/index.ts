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
        duration: z.enum(['5s', '10s']).optional()
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
        duration: z.enum(['5s', '10s']).optional()
      }))
      .mutation(async ({ input }) => {
        const generation = await videoService.generateVideo(input);
        return await videoService.waitForCompletion(generation.id);
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
