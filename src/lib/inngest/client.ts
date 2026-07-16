import { Inngest } from "inngest";

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
