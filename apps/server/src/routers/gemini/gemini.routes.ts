import { z } from "zod";
import { publicProcedure, router } from "../../lib/trpc";
import { generateImageWithGemini } from "../../services/gemini";
import { videoService } from "../../services/video";

const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1000, "Prompt too long")
});

const generateImageAndVideoSchema = z.object({
  imagePrompt: z.string().min(1, "Image prompt is required").max(1000, "Image prompt too long"),
  videoPrompt: z.string().min(1, "Video prompt is required").max(500, "Video prompt too long").default("A gentle animation with smooth movement")
});

export const geminiRouter = router({
  generateImage: publicProcedure
    .input(generateImageSchema)
    .mutation(async ({ input }) => {
      try {
        const result = await generateImageWithGemini({
          prompt: input.prompt
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to generate image");
        }

        return {
          success: true,
          imageUrl: result.imageUrl,
          enhancedPrompt: (result as any).enhancedPrompt
        };
      } catch (error) {
        console.error("Error in generateImage mutation:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to generate image");
      }
    }),

  generateImageAndVideo: publicProcedure
    .input(generateImageAndVideoSchema)
    .mutation(async ({ input }) => {
      try {
        console.log('Starting image+video generation:', input);
        
        // Step 1: Generate image with Gemini
        console.log('Step 1: Generating image...');
        const imageResult = await generateImageWithGemini({
          prompt: input.imagePrompt
        });

        if (!imageResult.success || !imageResult.imageUrl) {
          throw new Error(imageResult.error || "Failed to generate image");
        }

        console.log('✅ Image generated:', imageResult.imageUrl);

        // Step 2: Generate video with LumaAI using the image
        console.log('Step 2: Generating video...');
        const videoGeneration = await videoService.generateVideo({
          prompt: input.videoPrompt,
          imageUrl: imageResult.imageUrl
        });

        console.log('Video generation started:', videoGeneration.id);

        // Step 3: Wait for video completion
        console.log('Step 3: Waiting for video completion...');
        const completedVideo = await videoService.waitForCompletion(videoGeneration.id);

        if (completedVideo.status !== 'completed' || !completedVideo.videoUrl) {
          throw new Error(completedVideo.failureReason || "Video generation failed");
        }

        console.log('✅ Video generated:', completedVideo.videoUrl);

        return {
          success: true,
          imageUrl: imageResult.imageUrl,
          videoUrl: completedVideo.videoUrl,
          generationId: completedVideo.id
        };

      } catch (error) {
        console.error("Error in generateImageAndVideo mutation:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to generate image and video");
      }
    })
});

export type GeminiRouter = typeof geminiRouter;