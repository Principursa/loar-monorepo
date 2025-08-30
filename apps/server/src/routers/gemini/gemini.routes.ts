import { z } from "zod";
import { publicProcedure, router } from "../../lib/trpc";
import { generateImageWithGemini } from "../../services/gemini";

const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1000, "Prompt too long")
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
    })
});

export type GeminiRouter = typeof geminiRouter;