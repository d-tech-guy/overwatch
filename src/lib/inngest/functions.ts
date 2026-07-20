import { inngest } from "./client";
import { InvestigationService } from "@/lib/ai/investigation-service";
import { InvestigationRepository } from "@/lib/db/repositories/investigation.repository";
import { RaidService } from "@/lib/raid/raid-service";

/**
 * Background worker that executes the entire Investigation pipeline.
 *
 * Inngest provides:
 *   - Automatic retries (3 attempts)
 *   - Full observability and event history
 *   - Durable execution — survives server restarts
 */
export const processInvestigation = inngest.createFunction(
  {
    id: "process-investigation",
    name: "Process Investigation Pipeline",
    retries: 3,
    triggers: [{ event: "investigation/created" }],
  },
  async ({ event }: { event: { data: { investigationId: string } } }) => {
    const { investigationId } = event.data;

    // Emit terminal event: Worker has started
    await InvestigationRepository.logEvent(
      investigationId,
      "worker_connected",
      "✓ Worker connected. Pipeline execution started.",
      0,
      {
        stage: "queued",
        severity: "success",
        type: "worker_connected",
        shortMessage: "Inngest worker connected and pipeline starting",
      }
    );

    await InvestigationService.runPipeline(investigationId);
    return { status: "completed", investigationId };
  }
);

/**
 * Background worker that executes a Threat Raid operation.
 */
export const processRaid = inngest.createFunction(
  {
    id: "process-raid",
    name: "Process Threat Raid",
    retries: 2,
    triggers: [{ event: "raid/created" }],
  },
  async ({ event }: { event: { data: { raidId: string } } }) => {
    const { raidId } = event.data;
    await RaidService.executeRaidAsync(raidId);
    return { status: "completed", raidId };
  }
);
