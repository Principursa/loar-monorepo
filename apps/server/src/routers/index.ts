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

import { falService } from "../services/fal";

import { cinematicUniversesRouter } from "./cinematicUniverses/cinematicUniverses.index";
import { falRouter } from "./fal/fal.routes";
import { swapRouter } from "./swap/swap.routes";
import { synapseService } from "../services/synapse";
import { wikiaService } from "../services/wikia";
import { minioService } from "../services/minio";
import { geminiService } from "../services/gemini";
import { eventWikis } from "../db/schema";


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
  swap: swapRouter,
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
    // Generate wikia entry for a video node/event
    generateEventWikia: publicProcedure
      .input(z.object({
        nodeId: z.number(),
        title: z.string(),
        description: z.string(),
        videoUrl: z.string(),
        previousNodes: z.array(z.object({
          title: z.string(),
          plot: z.string(),
        })).optional(),
        nextNodes: z.array(z.object({
          title: z.string(),
          plot: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const wikiaEntry = await wikiaService.generateWikiaEntry(
            input.nodeId,
            input.title,
            input.description,
            input.videoUrl,
            input.previousNodes,
            input.nextNodes
          );
          return wikiaEntry;
        } catch (error) {
          console.error("Failed to generate wikia entry:", error);
          throw new Error("Could not generate wikia entry");
        }
      }),
    // Generate detailed storyline from simple user prompt (for event creation)
    generateStoryline: publicProcedure
      .input(z.object({
        prompt: z.string().min(1, "Prompt is required"),
        characters: z.array(z.string()).optional(),
        previousEvents: z.array(z.object({
          title: z.string(),
          description: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await wikiaService.generateStorylineFromPrompt(
            input.prompt,
            input.characters || [],
            input.previousEvents
          );
          return result;
        } catch (error) {
          console.error("Failed to generate storyline:", error);
          throw new Error("Could not generate storyline");
        }
      }),

    // Generate wiki from video using Gemini 2.5 Pro
    generateFromVideo: publicProcedure
      .input(z.object({
        universeId: z.string(),
        eventId: z.string(),
        videoUrl: z.string(),
        title: z.string(),
        description: z.string(),
        characterIds: z.array(z.string()).optional(),
        characters: z.array(z.object({
          name: z.string(),
          userDescription: z.string(),
          visualDescription: z.string().optional(),
        })).optional(),
        previousEvents: z.array(z.object({
          title: z.string(),
          description: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          console.log(`🎬 Generating wiki for ${input.universeId}-${input.eventId}`);

          // If characterIds are provided but not full character data, fetch from DB
          let characterData = input.characters;
          if (!characterData && input.characterIds && input.characterIds.length > 0) {
            console.log(`📥 Fetching character data for IDs: ${input.characterIds.join(', ')}`);
            const charResults = await Promise.all(
              input.characterIds.map(id =>
                db.select().from(characters).where(eq(characters.id, id))
              )
            );
            characterData = charResults
              .filter(result => result.length > 0)
              .map(result => ({
                name: result[0].character_name,
                userDescription: result[0].description,
                visualDescription: result[0].detailed_visual_description || undefined,
              }));
            console.log(`✅ Fetched ${characterData.length} characters`);
          }

          // Generate wiki using Gemini
          const result = await geminiService.generateWikiFromVideo(
            input.videoUrl,
            {
              eventId: input.eventId,
              title: input.title,
              description: input.description,
              characterIds: input.characterIds,
              characters: characterData,
              previousEvents: input.previousEvents,
            }
          );

          // Save to database (upsert to handle regeneration)
          const wikiId = `${input.universeId}-${input.eventId}`;
          const wikiEntry = {
            id: wikiId,
            universeId: input.universeId,
            eventId: input.eventId,
            wikiData: result.wikiData,
            videoUrl: input.videoUrl,
            eventTitle: input.title,
            eventDescription: input.description,
            characterIds: input.characterIds || null,
            generatedBy: result.metadata.generatedBy,
            tokensUsed: result.metadata.tokensUsed,
            inputTokens: result.metadata.inputTokens,
            outputTokens: result.metadata.outputTokens,
            costUsd: result.metadata.costUsd.toString(),
            generatedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          // Use onConflictDoUpdate to handle regeneration (upsert)
          await db.insert(eventWikis).values(wikiEntry).onConflictDoUpdate({
            target: eventWikis.id,
            set: {
              wikiData: result.wikiData,
              videoUrl: input.videoUrl,
              eventTitle: input.title,
              eventDescription: input.description,
              characterIds: input.characterIds || null,
              generatedBy: result.metadata.generatedBy,
              tokensUsed: result.metadata.tokensUsed,
              inputTokens: result.metadata.inputTokens,
              outputTokens: result.metadata.outputTokens,
              costUsd: result.metadata.costUsd.toString(),
              generatedAt: new Date(),
              updatedAt: new Date(),
            }
          });

          console.log(`✅ Wiki saved to database: ${wikiId}`);

          return {
            success: true,
            wikiId,
            wikiData: result.wikiData,
            metadata: result.metadata,
          };
        } catch (error) {
          console.error("Failed to generate wiki:", error);
          throw new Error(`Wiki generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }),

    // Get wiki by ID
    getWiki: publicProcedure
      .input(z.object({
        universeId: z.string(),
        eventId: z.string(),
      }))
      .query(async ({ input }) => {
        try {
          const wikiId = `${input.universeId}-${input.eventId}`;
          const wiki = await db.select()
            .from(eventWikis)
            .where(eq(eventWikis.id, wikiId))
            .limit(1);

          if (wiki.length === 0) {
            return null;
          }

          return wiki[0];
        } catch (error) {
          console.error("Failed to fetch wiki:", error);
          throw new Error("Could not fetch wiki");
        }
      }),

    // Get all wikis for a universe
    getUniverseWikis: publicProcedure
      .input(z.object({
        universeId: z.string(),
      }))
      .query(async ({ input }) => {
        try {
          const wikis = await db.select()
            .from(eventWikis)
            .where(eq(eventWikis.universeId, input.universeId))
            .orderBy(eventWikis.createdAt);

          return wikis;
        } catch (error) {
          console.error("Failed to fetch universe wikis:", error);
          throw new Error("Could not fetch universe wikis");
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
  minio: router({
    uploadFromUrl: publicProcedure
      .input(z.object({
        url: z.string().min(1, "URL is required"),
        filename: z.string().optional()
      }))
      .mutation(async ({ input}) => {
        try {
          console.log(`MinIO S3 upload for ${input.url}`)
          const result = await minioService.uploadFromUrl(input.url, input.filename)
          console.log(`MinIO S3 upload successful - key:`, result)

          // Return both the key and the public URL
          return {
            key: result,
            url: minioService.getPublicUrl(result)
          };
        } catch (error) {
          console.error("MinIO upload error:", error)
          throw error
        }
      }),
    download: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        try {
          console.log(`Starting MinIO download for key: ${input.key}`);

          const data = await minioService.download(input.key);

          console.log(`Downloaded ${data.length} bytes for key: ${input.key}`);

          // Check if data is too large (> 5MB for tRPC transport safety)
          if (data.length > 5 * 1024 * 1024) {
            console.error(`File too large for tRPC: ${Math.round(data.length / 1024 / 1024)}MB`);
            throw new Error(`File too large for tRPC: ${Math.round(data.length / 1024 / 1024)}MB (max 5MB). Use public URL instead.`);
          }

          try {
            console.log(`🔄 Converting ${data.length} bytes to base64...`);

            const base64Data = Buffer.from(data).toString('base64');

            console.log(`✅ Base64 conversion successful, encoded length: ${base64Data.length}`);

            return {
              data: base64Data,
              key: input.key,
              originalSize: data.length,
              encodedSize: base64Data.length
            };

          } catch (base64Error) {
            console.error(`❌ Base64 conversion failed for ${input.key}:`, base64Error);
            throw new Error(`Base64 encoding failed: File too large for memory. Use public URL instead.`);
          }
        } catch (error) {
          console.error(`Failed to download key ${input.key}:`, error);
          throw new Error(`Failed to download from MinIO: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }),
    getPublicUrl: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(({ input }) => {
        return { url: minioService.getPublicUrl(input.key) };
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
});
export type AppRouter = typeof appRouter;
