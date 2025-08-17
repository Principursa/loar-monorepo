import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../../lib/trpc";
import { createCinematicUniverse, getCinematicUniverse, getAllCinematicUniverses, getCinematicUniversesByCreator } from "./cinematicUniverses.handlers";

const createCinematicUniverseSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
  creator: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid creator address"),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid token address"),
  governanceAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid governance address"),
  imageUrl: z.string().url("Invalid image URL"),
  description: z.string().min(1, "Description is required").max(1000, "Description too long")
});

const getCinematicUniverseSchema = z.object({
  id: z.string().min(1, "ID is required")
});

const getByCreatorSchema = z.object({
  creator: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid creator address")
});

export const cinematicUniversesRouter = router({
  // Create a new cinematic universe
  createcu: protectedProcedure
    .input(createCinematicUniverseSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify the authenticated user's address matches the creator address
      if (ctx.session.user.id !== input.creator) {
        throw new Error("Creator address must match authenticated user");
      }
      
      return await createCinematicUniverse(input);
    }),

  // Get a specific cinematic universe by ID
  get: publicProcedure
    .input(getCinematicUniverseSchema)
    .query(async ({ input }) => {
      return await getCinematicUniverse(input.id);
    }),

  // Get all cinematic universes
  getAll: publicProcedure
    .query(async () => {
      return await getAllCinematicUniverses();
    }),

  // Get cinematic universes by creator address
  getByCreator: publicProcedure
    .input(getByCreatorSchema)
    .query(async ({ input }) => {
      return await getCinematicUniversesByCreator(input.creator);
    })
});

export type CinematicUniversesRouter = typeof cinematicUniversesRouter;