import { ponder } from "ponder:registry";
import {setHookEvent} from "ponder:schema";


ponder.on("UniverseManager:SetHook", async ({ event, context }) => {
  await context.db
    .insert(setHookEvent)
    .values({ id: event.log.id, timestamp: event.block.timestamp, hook_address: event.args.hook, enabled: event.args.enabled })
});
