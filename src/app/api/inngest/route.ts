import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { processInvestigation, processRaid } from "@/lib/inngest/functions";

// All registered Inngest functions.
// Every function exported from lib/inngest/functions.ts must appear here.
const functions = [processInvestigation, processRaid];

if (process.env.NODE_ENV === "development") {
  console.log("[Inngest] API Endpoint /api/inngest");
  console.log(`[Inngest] Registered Functions: ${functions.map((f) => f["id"] ?? "unknown").join(", ")}`);
  console.log(`[Inngest] Registered Events: investigation/created, raid/created`);
  console.log(`[Inngest] Mode: ${process.env.NODE_ENV}`);
}

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});
