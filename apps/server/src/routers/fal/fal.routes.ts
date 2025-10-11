import { router, publicProcedure } from "../../lib/trpc";
import { z } from "zod";
import { falService } from "../../services/fal";
import { db } from "../../db";
import { characters } from "../../db/schema/characters";

export const falRouter = router({
  // Test FAL connection
  testConnection: publicProcedure.query(async () => {
    try {
      const hasKey = !!process.env.FAL_KEY;
      return {
        success: true,
        hasApiKey: hasKey,
        keyLength: hasKey ? process.env.FAL_KEY!.length : 0,
        message: hasKey ? "FAL API key is configured" : "FAL API key is missing",
      };
    } catch (error) {
      return {
        success: false,
        hasApiKey: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }),

  // Image Generation with Nano Banana
  generateImage: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1, "Prompt is required"),
        model: z
          .enum([
            "fal-ai/nano-banana",
            "fal-ai/flux/dev",
            "fal-ai/flux-pro",
            "fal-ai/flux/schnell",
          ])
          .optional(),
        negativePrompt: z.string().optional(),
        imageSize: z
          .enum([
            "square_hd",
            "square",
            "portrait_4_3",
            "portrait_16_9",
            "landscape_4_3",
            "landscape_16_9",
          ])
          .optional(),
        numInferenceSteps: z.number().min(1).max(50).optional(),
        guidanceScale: z.number().min(1).max(20).optional(),
        numImages: z.number().min(1).max(4).optional(),
        seed: z.number().optional(),
        enableSafetyChecker: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await falService.generateImage(input);
    }),

  // Image Editing with Nano Banana
  editImage: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1, "Edit prompt is required"),
        imageUrls: z.array(z.string().url()).min(1),
        numImages: z.number().min(1).max(4).optional(),
        strength: z.number().min(0.1).max(1.0).optional(),
        negativePrompt: z.string().optional(),
        numInferenceSteps: z.number().min(1).max(50).optional(),
        guidanceScale: z.number().min(1).max(20).optional(),
        seed: z.number().optional(),
        enableSafetyChecker: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("🚨 === TRPC ROUTER: editImage called ===");
      console.log("Input received:", JSON.stringify(input, null, 2));
      try {
        const result = await falService.editImage(input);
        console.log("🚨 FAL service returned:", JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        console.error("🚨 FAL service error:", error);
        throw error;
      }
    }),

  imageToImage: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1).max(2000),
        imageUrls: z.array(z.string().url()).min(1).max(2),
        negativePrompt: z.string().max(500).optional(),
        imageSize: z.union([
          z.enum(['square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9']),
          z.object({
            width: z.number().min(384).max(5000),
            height: z.number().min(384).max(5000)
          })
        ]).optional(),
        numImages: z.number().min(1).max(4).optional().default(1),
        seed: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("🖼️ === TRPC ROUTER: imageToImage called ===");
      console.log("Input received:", JSON.stringify(input, null, 2));
      try {
        const result = await falService.imageToImage(input);
        console.log("🖼️ FAL imageToImage service returned:", JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        console.error("🖼️ FAL imageToImage service error:", error);
        throw error;
      }
    }),

  // Character Generation with Nano Banana + DB Save
  generateCharacter: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        style: z.enum(["cute", "realistic", "anime", "fantasy", "cyberpunk"]).optional(),
        saveToDatabase: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const stylePrompts = {
        cute: "cute kawaii style, adorable, soft colors",
        realistic: "photorealistic, detailed, cinematic lighting",
        anime: "anime style, manga aesthetic, vibrant",
        fantasy: "fantasy art, magical, ethereal",
        cyberpunk: "cyberpunk style, neon, futuristic",
      };

      const stylePrompt = input.style ? stylePrompts[input.style] : stylePrompts.cute;
      const fullPrompt = `Character portrait of ${input.name}, ${input.description}, ${stylePrompt}, high quality digital art, detailed character design, clean uniform background, no text, no letters, no words, simple background, character focus`;

      const imageResult = await falService.generateImage({
        prompt: fullPrompt,
        model: "fal-ai/nano-banana",
        imageSize: "square_hd",
        numImages: 1,
      });

      if (imageResult.status !== "completed" || !imageResult.imageUrl) {
        throw new Error(imageResult.error || "Failed to generate character image");
      }

      let characterId: string | undefined;
      let localImageUrl: string | undefined;

      if (input.saveToDatabase) {
        // Use the original FAL image URL directly instead of uploading to Walrus
        localImageUrl = imageResult.imageUrl;

        characterId = `nano-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        await db.insert(characters).values({
          id: characterId,
          character_name: input.name,
          collection: "Nano Banana AI",
          token_id: characterId,
          traits: {
            style: input.style || "cute",
            generated_with: "nano-banana",
            seed: imageResult.seed?.toString() || "random",
          },
          rarity_rank: 0,
          rarity_percentage: null,
          image_url: localImageUrl,
          description: input.description,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      return {
        success: true,
        characterId,
        characterName: input.name,
        imageUrl: imageResult.imageUrl,
        localImageUrl,
        seed: imageResult.seed,
        prompt: fullPrompt,
      };
    }),

  // Character + Video pipeline
  generateCharacterAndVideo: publicProcedure
    .input(
      z.object({
        characterName: z.string().min(1),
        characterDescription: z.string().min(1),
        characterStyle: z.enum(["cute", "realistic", "anime", "fantasy", "cyberpunk"]).optional(),
        videoPrompt: z.string().min(1),
        videoDuration: z.number().min(5).max(10).optional(),
        videoProvider: z.enum(["fal"]).optional().default("fal"),
      })
    )
    .mutation(async ({ input }) => {
      // Step 1: Character
      const stylePrompts = {
        cute: "cute kawaii style, adorable, soft colors",
        realistic: "photorealistic, detailed, cinematic lighting",
        anime: "anime style, manga aesthetic, vibrant",
        fantasy: "fantasy art, magical, ethereal",
        cyberpunk: "cyberpunk style, neon, futuristic",
      };
      const stylePrompt = input.characterStyle ? stylePrompts[input.characterStyle] : stylePrompts.cute;
      const characterPrompt = `Character portrait of ${input.characterName}, ${input.characterDescription}, ${stylePrompt}, high quality digital art`;

      const imageResult = await falService.generateImage({
        prompt: characterPrompt,
        model: "fal-ai/nano-banana",
        imageSize: "square_hd",
        numImages: 1,
      });

      if (imageResult.status !== "completed" || !imageResult.imageUrl) {
        throw new Error(imageResult.error || "Failed to generate character image");
      }

      const characterId = `nano-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      // Use the original FAL image URL directly instead of uploading to Walrus
      const localImageUrl = imageResult.imageUrl;

      await db.insert(characters).values({
        id: characterId,
        character_name: input.characterName,
        collection: "Nano Banana AI",
        token_id: characterId,
        traits: {
          style: input.characterStyle || "cute",
          generated_with: "nano-banana",
          seed: imageResult.seed?.toString() || "random",
        },
        rarity_rank: 0,
        rarity_percentage: null,
        image_url: localImageUrl,
        description: input.characterDescription,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Step 2: Video
      const videoResult = await falService.generateVideo({
        prompt: input.videoPrompt,
        model: "fal-ai/veo3/fast/image-to-video",
        imageUrl: imageResult.imageUrl,
        duration: input.videoDuration || 5,
        aspectRatio: "16:9",
        motionStrength: 127,
      });

      return {
        success: true,
        character: {
          id: characterId,
          name: input.characterName,
          imageUrl: imageResult.imageUrl,
          localImageUrl,
        },
        video: {
          generationId: videoResult.id,
          status: videoResult.status,
          provider: input.videoProvider,
        },
      };
    }),

  // Video Generation
  generateVideo: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        model: z
          .enum([
            "fal-ai/hunyuan-video",
            "fal-ai/ltx-video",
            "fal-ai/cogvideox-5b",
            "fal-ai/runway-gen3",
            "fal-ai/veo3/fast/image-to-video",
            "fal-ai/kling-video/v2.5-turbo/pro/image-to-video",
            "fal-ai/wan-25-preview/image-to-video",
            "fal-ai/sora-2/image-to-video",
          ])
          .optional(),
        imageUrl: z.string().url().optional(),
        duration: z.number().min(1).max(10).optional(),
        fps: z.number().min(8).max(30).optional(),
        width: z.number().min(256).max(1920).optional(),
        height: z.number().min(256).max(1080).optional(),
        guidanceScale: z.number().min(1).max(20).optional(),
        numInferenceSteps: z.number().min(10).max(50).optional(),
        aspectRatio: z.enum(["16:9", "9:16", "1:1", "auto"]).optional(),
        motionStrength: z.number().min(1).max(255).optional(),
        negativePrompt: z.string().optional(),
        cfgScale: z.number().min(0.1).max(2.0).optional(),
        resolution: z.enum(["720p", "1080p", "auto"]).optional(),
        enablePromptExpansion: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await falService.generateVideo(input);
    }),

  getStatus: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input }) => {
      return await falService.getGenerationStatus(input.id);
    }),

  quickGenerate: publicProcedure
    .input(z.object({ prompt: z.string().min(1), imageUrl: z.string().url().optional() }))
    .mutation(async ({ input }) => {
      return await falService.generateVideo({
        prompt: input.prompt,
        imageUrl: input.imageUrl,
        model: "fal-ai/ltx-video",
        duration: 5,
        fps: 25,
        width: 768,
        height: 512,
        guidanceScale: 3,
        numInferenceSteps: 30,
      });
    }),

  veo3ImageToVideo: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        imageUrl: z.string().url(),
        duration: z.union([z.literal(5), z.literal(10)]).optional().default(5),
        aspectRatio: z.enum(["16:9", "9:16", "1:1"]).optional().default("16:9"),
        motionStrength: z.number().min(1).max(255).optional().default(127),
      })
    )
    .mutation(async ({ input }) => {
      return await falService.generateVideo({
        prompt: input.prompt,
        imageUrl: input.imageUrl,
        model: "fal-ai/veo3/fast/image-to-video",
        duration: input.duration,
        aspectRatio: input.aspectRatio,
        motionStrength: input.motionStrength,
      });
    }),

  klingVideo: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        imageUrl: z.string().url(),
        duration: z.union([z.literal(5), z.literal(10)]).optional().default(5),
        aspectRatio: z.enum(["16:9", "9:16", "1:1"]).optional().default("16:9"),
        negativePrompt: z.string().optional(),
        cfgScale: z.number().min(0.1).max(2.0).optional().default(0.5),
      })
    )
    .mutation(async ({ input }) => {
      return await falService.generateVideo({
        prompt: input.prompt,
        imageUrl: input.imageUrl,
        model: "fal-ai/kling-video/v2.5-turbo/pro/image-to-video",
        duration: input.duration,
        aspectRatio: input.aspectRatio,
        negativePrompt: input.negativePrompt,
        cfgScale: input.cfgScale,
      });
    }),

  wan25ImageToVideo: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        imageUrl: z.string().url(),
        duration: z.union([z.literal(5), z.literal(10)]).optional().default(5),
        resolution: z.enum(["720p", "1080p", "auto"]).optional().default("1080p"),
        negativePrompt: z.string().optional(),
        enablePromptExpansion: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ input }) => {
      return await falService.generateVideo({
        prompt: input.prompt,
        imageUrl: input.imageUrl,
        model: "fal-ai/wan-25-preview/image-to-video",
        duration: input.duration,
        resolution: input.resolution,
        negativePrompt: input.negativePrompt,
        enablePromptExpansion: input.enablePromptExpansion,
      });
    }),

  soraImageToVideo: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1, "Prompt is required for Sora video generation"),
        imageUrl: z.string().url("Valid image URL is required for Sora image-to-video"),
        duration: z.union([z.literal(4), z.literal(8), z.literal(12)]).optional().default(4),
        aspectRatio: z.enum(["16:9", "9:16", "1:1", "auto"]).optional().default("auto"),
        resolution: z.enum(["720p", "1080p", "auto"]).optional().default("auto"),
      })
    )
    .mutation(async ({ input }) => {
      return await falService.generateVideo({
        prompt: input.prompt,
        imageUrl: input.imageUrl,
        model: "fal-ai/sora-2/image-to-video",
        duration: input.duration,
        aspectRatio: input.aspectRatio,
        resolution: input.resolution,
      });
    }),
});
