import { pgTable, text, timestamp, integer, jsonb, decimal } from "drizzle-orm/pg-core";

export const cinematicUniverses = pgTable("cinematicUniverses", {
  id: text("id").primaryKey(),
  address: text("address").notNull(),
  creator: text("creator").notNull(),
  tokenAddress: text("tokenAddress").notNull(),
  governanceAddress: text("governanceAddress").notNull(),
  image_url: text("image_url").notNull(),
  description: text("description").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type cinematicUniverse = typeof cinematicUniverses.$inferSelect;
export type newCinematicUniverse = typeof cinematicUniverses.$inferInsert;
