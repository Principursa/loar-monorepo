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
import { synapseService } from "../services/synapse";
import { wikiaService } from "../services/wikia";
import { concatenateVideos, trimVideo } from "../services/video";
import { SynapseService } from "../services/synapse";
import { unlinkSync } from "fs";


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

    // Concatenate multiple videos into one and upload to Filecoin
    concatenateAndUpload: publicProcedure
      .input(z.union([
        // New format with trim support
        z.object({
          segments: z.array(z.object({
            url: z.string(),
            trimStart: z.number().min(0),
            trimEnd: z.number().min(0),
            originalDuration: z.number().min(0).optional(), // Original video duration
          })).min(1, 'At least one segment is required'),
        }),
        // Legacy format for backward compatibility
        z.object({
          videoUrls: z.array(z.string()).min(1, 'At least one video URL is required'),
        }),
      ]))
      .mutation(async ({ input }) => {
        console.log('🎬 === VIDEO CONCATENATION REQUEST ===');

        try {
          let concatenatedFilePath: string;

          // Handle new format with trim support
          if ('segments' in input) {
            console.log('Segments with trim info:', input.segments);

            const tmpDir = join(process.cwd(), '../..', 'tmp', 'loar-video-trim');
            const { mkdirSync, existsSync } = await import('fs');
            if (!existsSync(tmpDir)) {
              mkdirSync(tmpDir, { recursive: true });
            }

            // Trim each segment first
            const trimmedPaths: string[] = [];
            for (let i = 0; i < input.segments.length; i++) {
              const segment = input.segments[i];

              // Check if actual trim is needed (not just default values)
              // Trim is needed if:
              // 1. trimStart is greater than a small threshold (0.1s)
              // 2. trimEnd is less than the original duration (if provided)
              const hasStartTrim = segment.trimStart > 0.1;
              const hasEndTrim = segment.originalDuration
                ? Math.abs(segment.trimEnd - segment.originalDuration) > 0.1
                : false;
              const needsTrim = hasStartTrim || hasEndTrim;

              if (needsTrim) {
                console.log(`✂️ Trimming segment ${i + 1}: ${segment.trimStart}s - ${segment.trimEnd}s`);
                const trimmedPath = await trimVideo(segment.url, segment.trimStart, segment.trimEnd);
                trimmedPaths.push(trimmedPath);
              } else {
                // No trim needed, just download the original
                console.log(`⏭️ Segment ${i + 1}: no trim needed, downloading original`);
                const downloadPath = join(tmpDir, `download-${Date.now()}-${i}.mp4`);
                const response = await fetch(segment.url);
                const buffer = Buffer.from(await response.arrayBuffer());
                const { writeFileSync } = await import('fs');
                writeFileSync(downloadPath, buffer);
                trimmedPaths.push(downloadPath);
              }
            }

            // Now concatenate the trimmed/downloaded local files
            // We need to create a new concatenation function that works with local paths
            console.log(`🔗 Concatenating ${trimmedPaths.length} local video files...`);

            // Use the concatenateVideos function but we need to handle local files
            // Let's create a temporary function to concatenate local files
            const { concatenateLocalVideos } = await import('../services/video');
            concatenatedFilePath = await concatenateLocalVideos(trimmedPaths);

            // Cleanup trimmed files
            for (const path of trimmedPaths) {
              try {
                unlinkSync(path);
              } catch (err) {
                console.warn(`Failed to cleanup trimmed file ${path}:`, err);
              }
            }
          } else {
            // Legacy format - just concatenate without trimming
            console.log('Video URLs (legacy):', input.videoUrls);
            concatenatedFilePath = await concatenateVideos(input.videoUrls);
          }

          console.log('Concatenated file path:', concatenatedFilePath);

          const synapseService = await SynapseService.getInstance();
          const pieceCid = await synapseService.upload(concatenatedFilePath);
          console.log('✅ Uploaded to Filecoin with PieceCID:', pieceCid);

          try {
            unlinkSync(concatenatedFilePath);
            console.log('🧹 Cleaned up concatenated file');
          } catch (err) {
            console.warn('Failed to cleanup concatenated file:', err);
          }

          return {
            success: true,
            pieceCid,
          };
        } catch (error) {
          console.error('❌ Video concatenation failed:', error);
          throw new Error(`Video concatenation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }),

    // Trim a video and upload to Filecoin
    trimAndUpload: publicProcedure
      .input(z.object({
        videoUrl: z.string(),
        startTime: z.number().min(0, 'Start time must be >= 0'),
        endTime: z.number().min(0, 'End time must be >= 0'),
      }))
      .mutation(async ({ input }) => {
        console.log('✂️ === VIDEO TRIM REQUEST ===');
        console.log('Video URL:', input.videoUrl);
        console.log('Trim range:', `${input.startTime}s - ${input.endTime}s`);

        if (input.endTime <= input.startTime) {
          throw new Error('End time must be greater than start time');
        }

        try {
          const trimmedFilePath = await trimVideo(input.videoUrl, input.startTime, input.endTime);
          console.log('Trimmed file path:', trimmedFilePath);

          const synapseService = await SynapseService.getInstance();
          const pieceCid = await synapseService.upload(trimmedFilePath);
          console.log('✅ Uploaded to Filecoin with PieceCID:', pieceCid);

          try {
            unlinkSync(trimmedFilePath);
            console.log('🧹 Cleaned up trimmed file');
          } catch (err) {
            console.warn('Failed to cleanup trimmed file:', err);
          }

          return {
            success: true,
            pieceCid,
          };
        } catch (error) {
          console.error('❌ Video trimming failed:', error);
          throw new Error(`Video trimming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
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
