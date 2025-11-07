import {index ,onchainTable, primaryKey, relations, timestamp} from "ponder";


/*export const universeCreatedEvent = onchainTable(
  "universe_created_event",
  (t) => ({
    id: t.text().primaryKey(),
    timestamp: t.integer().notNull(),
    creator: t.hex().notNull(),
    universe: t.hex().notNull(),
  }),
  (table) => ({
    numberIdx: index("number_index").on(table.creator),
  }),
);*/

export const setHookEvent = onchainTable(
  "hook_event",
  (t) => ({
    id: t.text().primaryKey(),
    timestamp: t.integer().notNull(),
    hook_address: t.hex().notNull(),
    enabled: t.boolean().notNull(),
  })
)
