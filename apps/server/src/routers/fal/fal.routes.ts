import { router, publicProcedure } from "../../lib/trpc";
import { z } from "zod";
import { falService } from "../../services/fal";
import { db } from "../../db";
import { characters } from "../../db/schema/characters";

export const falRouter = router({
  // Test FAL connection
  testConnection: publicProcedure
    .query(async () => {
      try {
        const hasKey = !!process.env.FAL_KEY;
        return {
          success: true,
          hasApiKey: hasKey,
          keyLength: hasKey ? process.env.FAL_KEY!.length : 0,
          message: hasKey ? 'FAL API key is configured' : 'FAL API key is missing'
        };
      } catch (error) {
        return {
          success: false,
          hasApiKey: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }),

  // Image Generation with Nano Banana
  generateImage: publicProcedure
    .input(z.object({
      prompt: z.string().min(1, "Prompt is required"),
      model: z.enum(['fal-ai/nano-banana', 'fal-ai/flux/dev', 'fal-ai/flux-pro', 'fal-ai/flux/schnell']).optional(),
      negativePrompt: z.string().optional(),
      imageSize: z.enum(['square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9']).optional(),
      numInferenceSteps: z.number().min(1).max(50).optional(),
      guidanceScale: z.number().min(1).max(20).optional(),
      numImages: z.number().min(1).max(4).optional(),
      seed: z.number().optional(),
      enableSafetyChecker: z.boolean().optional()
    }))
    .mutation(async ({ input }) => {
      return await falService.generateImage(input);
    }),

  // Image Editing with Nano Banana
  editImage: publicProcedure
    .input(z.object({
      prompt: z.string().min(1, "Edit prompt is required"),
      imageUrls: z.array(z.string().url()).min(1, "At least one image URL is required"),
      numImages: z.number().min(1).max(4).optional(),
      strength: z.number().min(0.1).max(1.0).optional(),
      negativePrompt: z.string().optional(),
      numInferenceSteps: z.number().min(1).max(50).optional(),
      guidanceScale: z.number().min(1).max(20).optional(),
      seed: z.number().optional(),
      enableSafetyChecker: z.boolean().optional()
    }))
    .mutation(async ({ input }) => {
      console.log('🚨 === TRPC ROUTER: editImage called ===');
      console.log('Input received:', JSON.stringify(input, null, 2));

      try {
        const result = await falService.editImage(input);
        console.log('🚨 FAL service returned:', JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        console.error('🚨 FAL service error:', error);
        throw error;
      }
    }),

  // Generate Character with Nano Banana and save to database
  generateCharacter: publicProcedure
    .input(z.object({
      name: z.string().min(1, "Character name is required"),
      description: z.string().min(1, "Character description is required"),
      style: z.enum(['cute', 'realistic', 'anime', 'fantasy', 'cyberpunk']).optional(),
      saveToDatabase: z.boolean().optional().default(true)
    }))
    .mutation(async ({ input }) => {
      try {
        // Build prompt for Nano Banana
        const stylePrompts = {
          cute: 'cute kawaii style, adorable, soft colors',
          realistic: 'photorealistic, detailed, cinematic lighting',
          anime: 'anime style, manga aesthetic, vibrant',
          fantasy: 'fantasy art, magical, ethereal',
          cyberpunk: 'cyberpunk style, neon, futuristic'
        };

        const stylePrompt = input.style ? stylePrompts[input.style] : stylePrompts.cute;
        const fullPrompt = `Character portrait of ${input.name}, ${input.description}, ${stylePrompt}, high quality digital art, detailed character design, clean uniform background, no text, no letters, no words, simple background, character focus`;

        // Generate image with Nano Banana (with fallback to Flux)
        let imageResult;

        console.log('🎨 Attempting character generation with Nano Banana...');
        imageResult = await falService.generateImage({
          prompt: fullPrompt,
          model: 'fal-ai/nano-banana',
          imageSize: 'square_hd',
          numImages: 1
        });


        if (imageResult.status !== 'completed' || !imageResult.imageUrl) {
          throw new Error(imageResult.error || 'Failed to generate character image');
        }

        let characterId: string | undefined;

        if (input.saveToDatabase) {
          // Save to database with FAL image URL directly
          characterId = `nano-${Date.now()}-${Math.random().toString(36).substring(7)}`;
          await db.insert(characters).values({
            id: characterId,
            character_name: input.name,
            collection: 'Nano Banana AI',
            token_id: characterId,
            traits: {
              style: input.style || 'cute',
              generated_with: 'nano-banana',
              seed: imageResult.seed?.toString() || 'random'
            },
            rarity_rank: 0,
            rarity_percentage: null,
            image_url: imageResult.imageUrl, // Use FAL URL directly
            description: input.description,
            created_at: new Date(),
            updated_at: new Date()
          });
        }

        return {
          success: true,
          characterId,
          characterName: input.name,
          imageUrl: imageResult.imageUrl,
          seed: imageResult.seed,
          prompt: fullPrompt
        };
      } catch (error) {
        console.error('Character generation failed:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to generate character');
      }
    }),

  // Generate Character and then Video (complete pipeline)
  generateCharacterAndVideo: publicProcedure
    .input(z.object({
      characterName: z.string().min(1, "Character name is required"),
      characterDescription: z.string().min(1, "Character description is required"),
      characterStyle: z.enum(['cute', 'realistic', 'anime', 'fantasy', 'cyberpunk']).optional(),
      videoPrompt: z.string().min(1, "Video prompt is required"),
      videoDuration: z.number().min(5).max(10).optional(),
      videoProvider: z.enum(['fal', 'lumaai', 'kling']).optional().default('fal')
    }))
    .mutation(async ({ input }) => {
      try {
        // Step 1: Generate character with Nano Banana
        const stylePrompts = {
          cute: 'cute kawaii style, adorable, soft colors',
          realistic: 'photorealistic, detailed, cinematic lighting',
          anime: 'anime style, manga aesthetic, vibrant',
          fantasy: 'fantasy art, magical, ethereal',
          cyberpunk: 'cyberpunk style, neon, futuristic'
        };

        const stylePrompt = input.characterStyle ? stylePrompts[input.characterStyle] : stylePrompts.cute;
        const characterPrompt = `Character portrait of ${input.characterName}, ${input.characterDescription}, ${stylePrompt}, high quality digital art, detailed character design, clean uniform background, no text, no letters, no words, simple background, character focus`;

        console.log('🎨 Step 1: Generating character with Nano Banana...');
        const imageResult = await falService.generateImage({
          prompt: characterPrompt,
          model: 'fal-ai/nano-banana',
          imageSize: 'square_hd',
          numImages: 1
        });

        if (imageResult.status !== 'completed' || !imageResult.imageUrl) {
          throw new Error(imageResult.error || 'Failed to generate character image');
        }

        console.log('✅ Character generated:', imageResult.imageUrl);

        // Save character to database
        const characterId = `nano-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        await db.insert(characters).values({
          id: characterId,
          character_name: input.characterName,
          collection: 'Nano Banana AI',
          token_id: characterId,
          traits: {
            style: input.characterStyle || 'cute',
            generated_with: 'nano-banana',
            seed: imageResult.seed?.toString() || 'random'
          },
          rarity_rank: 0,
          rarity_percentage: null,
          image_url: imageResult.imageUrl, // Use FAL URL directly
          description: input.characterDescription,
          created_at: new Date(),
          updated_at: new Date()
        });

        // Step 2: Generate video from character image
        console.log('🎬 Step 2: Generating video from character...');
        let videoGenerationId: string;
        let videoStatus: string;

        if (input.videoProvider === 'fal') {
          // Use FAL's Veo3 for image-to-video
          const videoResult = await falService.generateVideo({
            prompt: input.videoPrompt,
            model: 'fal-ai/veo3/fast/image-to-video',
            imageUrl: imageResult.imageUrl,
            duration: input.videoDuration || 5,
            aspectRatio: '16:9',
            motionStrength: 127
          });
          videoGenerationId = videoResult.id;
          videoStatus = videoResult.status;
        } else if (input.videoProvider === 'lumaai') {
          // Use LumaAI
          const { videoService } = await import('../../services/video');
          const videoResult = await videoService.generateVideo({
            prompt: input.videoPrompt,
            imageUrl: imageResult.imageUrl
          });
          videoGenerationId = videoResult.id;
          videoStatus = videoResult.status;
        } else {
          // Use Kling
          const { klingService } = await import('../../services/kling');
          const videoResult = await klingService.createMultiImageVideo({
            image_list: [{
              image: `https://images.weserv.nl/?url=${encodeURIComponent(imageResult.imageUrl)}`
            }],
            prompt: input.videoPrompt,
            mode: 'std',
            duration: String(input.videoDuration || 5) as '5' | '10',
            aspect_ratio: '16:9'
          });
          videoGenerationId = videoResult.data.task_id;
          videoStatus = videoResult.data.task_status;
        }

        console.log('✅ Video generation started:', videoGenerationId);

        return {
          success: true,
          character: {
            id: characterId,
            name: input.characterName,
            imageUrl: imageResult.imageUrl
          },
          video: {
            generationId: videoGenerationId,
            status: videoStatus,
            provider: input.videoProvider
          }
        };

      } catch (error) {
        console.error('Character and video generation failed:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to generate character and video');
      }
    }),

  generateVideo: publicProcedure
    .input(z.object({
      prompt: z.string().min(1, "Prompt is required"),
      model: z.enum([
        'fal-ai/hunyuan-video',
        'fal-ai/ltx-video',
        'fal-ai/cogvideox-5b',
        'fal-ai/runway-gen3',
        'fal-ai/veo3/fast/image-to-video'
      ]).optional(),
      imageUrl: z.string().url().optional(),
      duration: z.number().min(1).max(10).optional(),
      fps: z.number().min(8).max(30).optional(),
      width: z.number().min(256).max(1920).optional(),
      height: z.number().min(256).max(1080).optional(),
      guidanceScale: z.number().min(1).max(20).optional(),
      numInferenceSteps: z.number().min(10).max(50).optional(),
      aspectRatio: z.enum(["16:9", "9:16", "1:1"]).optional(),
      motionStrength: z.number().min(1).max(255).optional()
    }))
    .mutation(async ({ input }) => {
      return await falService.generateVideo(input);
    }),

  getStatus: publicProcedure
    .input(z.object({
      id: z.string().min(1, "ID is required")
    }))
    .query(async ({ input }) => {
      return await falService.getGenerationStatus(input.id);
    }),

  // Quick generation with sensible defaults
  quickGenerate: publicProcedure
    .input(z.object({
      prompt: z.string().min(1, "Prompt is required"),
      imageUrl: z.string().url().optional()
    }))
    .mutation(async ({ input }) => {
      return await falService.generateVideo({
        prompt: input.prompt,
        imageUrl: input.imageUrl,
        model: 'fal-ai/ltx-video', // Fast and good quality
        duration: 5,
        fps: 25,
        width: 768,
        height: 512,
        guidanceScale: 3,
        numInferenceSteps: 30
      });
    }),

  // Veo3 image-to-video with optimized parameters
  veo3ImageToVideo: publicProcedure
    .input(z.object({
      prompt: z.string().min(1, "Prompt is required"),
      imageUrl: z.string().url(),
      duration: z.union([z.literal(5), z.literal(10)]).optional().default(5),
      aspectRatio: z.enum(["16:9", "9:16", "1:1"]).optional().default("16:9"),
      motionStrength: z.number().min(1).max(255).optional().default(127)
    }))
    .mutation(async ({ input }) => {
      return await falService.generateVideo({
        prompt: input.prompt,
        imageUrl: input.imageUrl,
        model: 'fal-ai/veo3/fast/image-to-video',
        duration: input.duration,
        aspectRatio: input.aspectRatio,
        motionStrength: input.motionStrength
      });
    })
});