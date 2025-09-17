import { z } from 'zod';
import { publicProcedure, router } from '../../lib/trpc';
import { generateVideoWithLumaAI, generateVideoWithReplicate } from '../../services/lumaai';

export const lumaaiRouter = router({
  generateVideo: publicProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
        prompt: z.string().optional(),
        aspectRatio: z.enum(['16:9', '9:16', '1:1']).optional().default('16:9'),
        loop: z.boolean().optional().default(false),
        provider: z.enum(['lumaai', 'replicate']).optional().default('replicate') // Use Replicate as default since it's more accessible
      })
    )
    .mutation(async ({ input }) => {
      const { imageUrl, prompt, aspectRatio, loop, provider } = input;
      
      if (provider === 'lumaai') {
        return await generateVideoWithLumaAI({
          imageUrl,
          prompt,
          aspectRatio,
          loop
        });
      } else {
        return await generateVideoWithReplicate({
          imageUrl,
          prompt
        });
      }
    }),
});