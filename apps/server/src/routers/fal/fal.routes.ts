import { router, publicProcedure } from "../../lib/trpc";
import { z } from "zod";
import { falService } from "../../services/fal";

export const falRouter = router({
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