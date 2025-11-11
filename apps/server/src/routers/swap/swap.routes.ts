import { publicProcedure, router } from "../../lib/trpc";
import { z } from "zod";
import { swapService } from "../../services/swap";

const tokenInfoSchema = z.object({
  id: z.string(),
  poolHook: z.string(),
  startingTick: z.boolean(),
});

export const swapRouter = router({
  /**
   * Get a quote for swapping WETH to a governance token
   */
  getQuote: publicProcedure
    .input(
      z.object({
        tokenAddress: z.string(),
        amountIn: z.string(),
        tokenInfo: tokenInfoSchema,
      })
    )
    .mutation(async ({ input }) => {
      try {
        const quote = await swapService.getQuote({
          tokenAddress: input.tokenAddress,
          amountIn: input.amountIn,
          tokenInfo: input.tokenInfo,
        });
        return quote;
      } catch (error) {
        console.error("Quote failed:", error);
        throw new Error(
          `Failed to get quote: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Build transaction calldata for swapping WETH to a governance token
   */
  buildSwap: publicProcedure
    .input(
      z.object({
        tokenAddress: z.string(),
        amountIn: z.string(),
        amountOutMinimum: z.string(),
        tokenInfo: tokenInfoSchema,
        deadline: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Default deadline: 1 hour from now
        const deadline = input.deadline || Math.floor(Date.now() / 1000) + 3600;

        const txData = await swapService.buildSwapTransaction({
          tokenAddress: input.tokenAddress,
          amountIn: input.amountIn,
          amountOutMinimum: input.amountOutMinimum,
          tokenInfo: input.tokenInfo,
          deadline,
        });

        return txData;
      } catch (error) {
        console.error("Build swap failed:", error);
        throw new Error(
          `Failed to build swap: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),
});
