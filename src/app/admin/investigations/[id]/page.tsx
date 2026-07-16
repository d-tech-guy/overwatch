import { notFound } from "next/navigation";
import Link from "next/link";
import { InvestigationRepository } from "@/lib/db/repositories/investigation.repository";
import { InvestigationTerminalRealtime } from "@/components/investigation-terminal";
import type { GeminiInvestigationResult } from "@/lib/ai/investigation";
import type { ApifyProfileMetadata } from "@/types/apify";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvestigationDetailPage({ params }: Props) {
  const { id } = await params;
  const investigation = await InvestigationRepository.findById(id);

  if (!investigation) {
    notFound();
  }

  const ai = investigation.aiResponseJson as
    | (GeminiInvestigationResult & {
        processingMs?: number;
        profile?: ApifyProfileMetadata;
        commentsRetrieved?: number;
      })
    | null;

  const initialEvents = (investigation.events ?? []).map((e) => ({
    id: e.id,
    event: e.event,
    description: e.description ?? "",
    createdAt: e.createdAt.toISOString(),
    progress: e.progress,
  }));

  const isTerminal =
    investigation.processingStatus === "completed" ||
    investigation.processingStatus === "failed";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-600 uppercase tracking-widest">
        <Link href="/admin/investigations" className="hover:text-zinc-400 transition-colors">
          Investigations
        </Link>
        <span>/</span>
        <span className="text-zinc-400">{investigation.publicId.split("-")[0].toUpperCase()}</span>
      </div>

      {/* ── Header ── */}
      <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Investigation</h2>
          <p className="text-zinc-500 font-mono text-xs mt-1 tracking-widest">
            {investigation.id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs uppercase px-3 py-1.5 border font-mono tracking-widest ${
              investigation.processingStatus === "completed"
                ? "border-zinc-600 text-white"
                : investigation.processingStatus === "failed"
                ? "border-zinc-700 text-zinc-500"
                : "border-zinc-800 text-zinc-400"
            }`}
          >
            {investigation.processingStatus.replace(/_/g, " ")}
          </span>
          {isTerminal && (
            <Link
              href={`/report/${investigation.id}`}
              className="text-xs uppercase tracking-widest font-mono font-semibold px-4 py-1.5 bg-white text-black hover:bg-zinc-200 transition-colors"
            >
              View Report
            </Link>
          )}
        </div>
      </div>

      {/* ── Metrics grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-zinc-800">
        {[
          { label: "Author", value: investigation.authorUsername ? `@${investigation.authorUsername}` : "—" },
          {
            label: "Risk Score",
            value: investigation.riskScore != null ? `${investigation.riskScore}/100` : "—",
          },
          {
            label: "Confidence",
            value:
              investigation.confidenceScore != null ? `${investigation.confidenceScore}%` : "—",
          },
          { label: "Progress", value: `${investigation.progress}%` },
        ].map((m) => (
          <div key={m.label} className="bg-zinc-950 p-4 border border-zinc-900">
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-mono mb-1">
              {m.label}
            </p>
            <p className="text-white font-mono text-sm font-semibold">{m.value}</p>
          </div>
        ))}
      </div>

      {/* ── Submitted URL ── */}
      <div className="border border-zinc-800 p-4">
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-mono mb-2">
          Submitted URL
        </p>
        <a
          href={investigation.submittedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-zinc-300 hover:text-white break-all transition-colors"
        >
          {investigation.submittedUrl}
        </a>
      </div>

      {/* ── AI Severity Flags ── */}
      {ai && (
        <div className="border border-zinc-800">
          <div className="border-b border-zinc-800 px-4 py-2">
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-mono">
              Threat Flags
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-zinc-900">
            {[
              { label: "Bullying", value: ai.containsBullying },
              { label: "Harassment", value: ai.containsHarassment },
              { label: "Threats", value: ai.containsThreat },
              { label: "Hate Speech", value: ai.containsHateSpeech },
              { label: "Incitement", value: ai.containsIncitement },
              { label: "Defamation", value: ai.containsDefamation },
              { label: "Reputation Damage", value: ai.reputationDamage },
              { label: "Immediate Review", value: ai.requiresImmediateReview },
            ].map((flag) => (
              <div key={flag.label} className="px-4 py-3">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-mono mb-1">
                  {flag.label}
                </p>
                <p
                  className={`font-mono text-xs font-semibold ${
                    flag.value ? "text-white" : "text-zinc-700"
                  }`}
                >
                  {flag.value ? "DETECTED" : "CLEAR"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI Summary ── */}
      {ai?.summary && (
        <div className="border border-zinc-800 p-4">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-mono mb-3">
            AI Summary
          </p>
          <p className="text-zinc-300 text-sm leading-relaxed">{ai.summary}</p>
        </div>
      )}

      {/* ── Recommendation ── */}
      {ai?.recommendation && (
        <div className="border-l-2 border-white border border-zinc-800 p-4">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-mono mb-3">
            Recommended Action
          </p>
          <p className="text-white text-sm leading-relaxed font-semibold">{ai.recommendation}</p>
        </div>
      )}

      {/* ── Operational Terminal ── */}
      <div>
        <div className="border-b border-zinc-800 pb-2 mb-0">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-mono">
            Operational Terminal
          </p>
        </div>
        <InvestigationTerminalRealtime
          investigationId={investigation.id}
          publicToken={investigation.publicId}
          initialEvents={initialEvents}
          initialStatus={investigation.processingStatus as string}
          initialProgress={investigation.progress}
        />
      </div>
    </div>
  );
}
