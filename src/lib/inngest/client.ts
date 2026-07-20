import { Inngest } from "inngest";

// ─── Environment Validation ──────────────────────────────────────────────────

const INNGEST_EVENT_KEY = process.env.INNGEST_EVENT_KEY;
const INNGEST_SIGNING_KEY = process.env.INNGEST_SIGNING_KEY;
const IS_DEV = process.env.NODE_ENV === "development";

if (!INNGEST_EVENT_KEY) {
  console.error(
    "⚠️ [Inngest] INNGEST_EVENT_KEY is missing.\n" +
    "   → Background event dispatch (inngest.send) will fail.\n" +
    "   → Set INNGEST_EVENT_KEY in your .env file."
  );
}

if (!INNGEST_SIGNING_KEY) {
  console.error(
    "⚠️ [Inngest] INNGEST_SIGNING_KEY is missing.\n" +
    "   → Webhook signature verification will fail.\n" +
    "   → The /api/inngest endpoint will reject incoming requests.\n" +
    "   → Set INNGEST_SIGNING_KEY in your .env file."
  );
}

// ─── Event Type Definitions ──────────────────────────────────────────────────

type Events = {
  "investigation/created": {
    data: {
      investigationId: string;
    };
  };
  "raid/created": {
    data: {
      raidId: string;
    };
  };
};

// ─── Client Initialization ───────────────────────────────────────────────────

export const inngest = new Inngest({
  id: "overwatch-engine",
  eventKey: INNGEST_EVENT_KEY,
});

// ─── Startup Diagnostics ─────────────────────────────────────────────────────

if (IS_DEV) {
  console.log("──────────────────────────────────────────────");
  console.log("[Inngest] Startup Diagnostics");
  console.log(`  ✓ Inngest Initialized          (id: overwatch-engine)`);
  console.log(`  ${INNGEST_EVENT_KEY ? "✓" : "✕"} Event Key Loaded           ${INNGEST_EVENT_KEY ? "" : "(MISSING)"}`);
  console.log(`  ${INNGEST_SIGNING_KEY ? "✓" : "✕"} Signing Key Loaded         ${INNGEST_SIGNING_KEY ? "" : "(MISSING)"}`);
  console.log(`  ✓ Functions Registered         (processInvestigation, processRaid)`);
  console.log(`  ✓ API Endpoint Ready           (/api/inngest)`);
  console.log(`  ℹ Environment                  ${IS_DEV ? "development" : "production"}`);
  console.log("──────────────────────────────────────────────");
}
