import { pgTable, text, timestamp, integer, jsonb, decimal } from "drizzle-orm/pg-core";

export const characters = pgTable("characters", {
  id: text("id").primaryKey(),
  character_name: text("character_name").notNull(),
  collection: text("collection").notNull(),
  token_id: text("token_id").notNull(),
  traits: jsonb("traits").notNull().$type<Record<string, string>>(),
  rarity_rank: integer("rarity_rank").notNull().default(0),
  rarity_percentage: decimal("rarity_percentage", { precision: 5, scale: 2 }),
  image_url: text("image_url").notNull(),
  description: text("description").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;