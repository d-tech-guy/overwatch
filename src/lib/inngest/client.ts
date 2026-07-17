import { Inngest } from "inngest";

if (!process.env.INNGEST_EVENT_KEY) {
  console.error("⚠️ [Inngest] INNGEST_EVENT_KEY environment variable is missing. Background events will fail to dispatch.");
}

if (!process.env.INNGEST_SIGNING_KEY) {
  console.error("⚠️ [Inngest] INNGEST_SIGNING_KEY environment variable is missing. Webhook verification will fail.");
}

// Define the event payloads that the background workers will process
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

// Create a client to send and receive events
export const inngest = new Inngest({ id: "overwatch-engine" });
