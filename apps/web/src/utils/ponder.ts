import { createClient } from "@ponder/client";
import * as schema from "../../../indexer/ponder.schema";

const PONDER_URL = import.meta.env.VITE_PONDER_URL || "http://localhost:42069/sql";

export const client = createClient(PONDER_URL, { schema });
