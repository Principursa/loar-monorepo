import { db } from "../../db";
import { cinematicUniverses } from "../../db/schema";
import { eq } from "drizzle-orm";
import type { newCinematicUniverse } from "../../db/schema/cinematicUniverses";

interface CreateCinematicUniverseInput {
  address: string;
  creator: string;
  tokenAddress: string;
  governanceAddress: string;
  imageUrl: string;
  description: string;
}

export async function createCinematicUniverse(input: CreateCinematicUniverseInput) {
  try {
    // Generate a unique ID based on the timeline contract address
    const id = input.address.toLowerCase();
    
    const newUniverse: newCinematicUniverse = {
      id,
      address: input.address,
      creator: input.creator,
      tokenAddress: input.tokenAddress,
      governanceAddress: input.governanceAddress,
      image_url: input.imageUrl,
      description: input.description
    };

    const result = await db.insert(cinematicUniverses).values(newUniverse).returning();
    
    return {
      success: true,
      data: result[0],
      message: "Cinematic universe created successfully"
    };
  } catch (error) {
    console.error("Error creating cinematic universe:", error);
    
    // Handle duplicate key error
    if (error instanceof Error && error.message.includes("duplicate key")) {
      throw new Error("A cinematic universe with this timeline contract address already exists");
    }
    
    throw new Error("Failed to create cinematic universe");
  }
}

export async function getCinematicUniverse(id: string) {
  try {
    const result = await db.select().from(cinematicUniverses).where(eq(cinematicUniverses.id, id));
    
    if (result.length === 0) {
      throw new Error("Cinematic universe not found");
    }
    
    return {
      success: true,
      data: result[0]
    };
  } catch (error) {
    console.error("Error fetching cinematic universe:", error);
    throw new Error("Failed to fetch cinematic universe");
  }
}

export async function getAllCinematicUniverses() {
  try {
    const result = await db.select().from(cinematicUniverses).orderBy(cinematicUniverses.created_at);
    
    return {
      success: true,
      data: result,
      total: result.length
    };
  } catch (error) {
    console.error("Error fetching all cinematic universes:", error);
    throw new Error("Failed to fetch cinematic universes");
  }
}

export async function getCinematicUniversesByCreator(creator: string) {
  try {
    const result = await db.select().from(cinematicUniverses)
      .where(eq(cinematicUniverses.creator, creator))
      .orderBy(cinematicUniverses.created_at);
    
    return {
      success: true,
      data: result,
      total: result.length
    };
  } catch (error) {
    console.error("Error fetching cinematic universes by creator:", error);
    throw new Error("Failed to fetch cinematic universes by creator");
  }
}
