import { pgTable, text, timestamp, integer, jsonb, decimal } from "drizzle-orm/pg-core";
import { cinematicUniverses } from "./cinematicUniverses";

/**
 * Event Wikis Table
 * Stores AI-generated wiki entries for timeline events
 */
export const eventWikis = pgTable("eventWikis", {
  // Primary key: compositeId format: `${universeId}-${eventId}`
  id: text("id").primaryKey(),

  // Foreign keys
  universeId: text("universeId")
    .notNull()
    .references(() => cinematicUniverses.id, { onDelete: "cascade" }),

  eventId: text("eventId").notNull(),

  // Wiki content (JSON structure from Gemini)
  wikiData: jsonb("wikiData").notNull().$type<{
    title: string;
    summary: string;
    videoAnalysis: {
      setting: string;
      visualStyle: string;
      subjects: string;
      action: string;
    };
    plot: string;
    elements: Array<{
      name: string;
      description: string;
      actions: string[];
      characterId?: string; // Optional character ID for linking to character images
    }>;
    keyMoments: string[];
    duration?: string;
    visualDetails?: string[];
  }>(),

  // Reference data
  videoUrl: text("videoUrl"),
  eventTitle: text("eventTitle"),
  eventDescription: text("eventDescription"),
  characterIds: jsonb("characterIds").$type<string[]>(), // Array of character IDs used in this event

  // Generation metadata
  generatedAt: timestamp("generatedAt").notNull().defaultNow(),
  generatedBy: text("generatedBy"), // Model used (e.g., "gemini-2.5-pro")

  // Cost tracking
  tokensUsed: integer("tokensUsed"),
  inputTokens: integer("inputTokens"),
  outputTokens: integer("outputTokens"),
  costUsd: decimal("costUsd", { precision: 10, scale: 6 }),

  // Timestamps
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// Types for TypeScript
export type EventWiki = typeof eventWikis.$inferSelect;
export type NewEventWiki = typeof eventWikis.$inferInsert;

// Wiki data type
export interface WikiData {
  title: string;
  summary: string;
  videoAnalysis: {
    setting: string;
    visualStyle: string;
    subjects: string;
    action: string;
  };
  plot: string;
  elements: Array<{
    name: string;
    description: string;
    actions: string[];
    characterId?: string; // Optional character ID for linking to character images
  }>;
  keyMoments: string[];
  duration?: string;
  visualDetails?: string[];
}
