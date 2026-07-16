import { notFound } from "next/navigation";
import { InvestigationRepository } from "@/lib/db/repositories/investigation.repository";
import type { GeminiInvestigationResult } from "@/lib/ai/investigation";
import type { ApifyProfileMetadata } from "@/types/apify";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

function Badge({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number | null | undefined;
  highlight?: "green" | "yellow" | "red" | "none";
}) {
  const color =
    highlight === "green"
      ? "text-green-400"
      : highlight === "yellow"
      ? "text-yellow-400"
      : highlight === "red"
      ? "text-red-400"
      : "text-white";

  return (
    <div className="border border-zinc-800 p-3">
      <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest mb-1">{label}</p>
      <p className={`font-mono text-sm font-semibold ${color}`}>{value ?? "N/A"}</p>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-zinc-800 pb-2 mb-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">{children}</h2>
    </div>
  );
}

function BooleanFlag({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between border border-zinc-900 px-3 py-2">
      <span className="font-mono text-xs text-zinc-400">{label}</span>
      <span className={`font-mono text-xs font-bold ${value ? "text-red-400" : "text-zinc-600"}`}>
        {value ? "DETECTED" : "CLEAR"}
      </span>
    </div>
  );
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const investigation = await InvestigationRepository.findById(id);

  if (!investigation) {
    notFound();
  }

  const ai = investigation.aiResponseJson as GeminiInvestigationResult & {
    processingMs?: number;
    geminiModel?: string;
    commentsRetrieved?: number;
    profile?: ApifyProfileMetadata;
  } | null;

  const events = investigation.events ?? [];
  const evidence = investigation.evidence ?? [];

  const severityColor =
    ai?.severity === "critical"
      ? "red"
      : ai?.severity === "high"
      ? "red"
      : ai?.severity === "medium"
      ? "yellow"
      : "green";

  const processingTime = ai?.processingMs
    ? `${(ai.processingMs / 1000).toFixed(1)}s`
    : "N/A";

  return (
    <main className="min-h-screen bg-black text-white font-mono">
      {/* Report Header */}
      <div className="border-b border-zinc-800 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-zinc-600 text-xs uppercase tracking-[0.3em] mb-1">Digital Forensic Report</p>
            <h1 className="text-2xl font-bold tracking-tight text-white">OVERWATCH</h1>
          </div>
          <div className="text-right">
            <p className="text-zinc-600 text-xs uppercase tracking-widest mb-1">Status</p>
            <p className={`text-sm font-bold uppercase ${
              investigation.processingStatus === "completed" ? "text-green-400" : "text-red-400"
            }`}>
              {investigation.processingStatus.replace(/_/g, " ")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-10">

        {/* ── Section 1: Investigation Metadata ── */}
        <section>
          <SectionHeader>Investigation</SectionHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Badge label="Investigation ID" value={investigation.id} />
            <Badge label="Public ID" value={investigation.publicId} />
            <Badge label="Date" value={investigation.createdAt.toLocaleDateString("en-GB")} />
            <Badge label="Time" value={investigation.createdAt.toLocaleTimeString("en-GB")} />
            <Badge label="Processing Time" value={processingTime} />
            <Badge label="Completed At" value={investigation.completedAt?.toLocaleString("en-GB") ?? "In Progress"} />
          </div>
        </section>

        {/* ── Section 2: TikTok Video ── */}
        <section>
          <SectionHeader>TikTok Video</SectionHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="col-span-full border border-zinc-800 p-3">
              <p className="text-zinc-600 text-xs uppercase tracking-widest mb-1">Original URL</p>
              <a
                href={investigation.submittedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 text-sm break-all hover:text-white"
              >
                {investigation.submittedUrl}
              </a>
            </div>
            {investigation.caption && (
              <div className="col-span-full border border-zinc-800 p-3">
                <p className="text-zinc-600 text-xs uppercase tracking-widest mb-1">Caption</p>
                <p className="text-zinc-200 text-sm">{investigation.caption}</p>
              </div>
            )}
            <Badge label="Author" value={investigation.authorUsername ? `@${investigation.authorUsername}` : null} />
            <Badge label="Upload Time" value={investigation.uploadTimestamp?.toLocaleString("en-GB") ?? null} />
            <Badge label="Likes" value={investigation.likeCount?.toLocaleString() ?? null} />
            <Badge label="Comments" value={investigation.commentCount?.toLocaleString() ?? null} />
            <Badge label="Shares" value={investigation.shareCount?.toLocaleString() ?? null} />
            {investigation.hashtags.length > 0 && (
              <div className="col-span-full border border-zinc-800 p-3">
                <p className="text-zinc-600 text-xs uppercase tracking-widest mb-2">Hashtags</p>
                <div className="flex flex-wrap gap-2">
                  {investigation.hashtags.map((tag) => (
                    <span key={tag} className="text-xs text-zinc-300 border border-zinc-700 px-2 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Section 3: Creator Profile ── */}
        {ai?.profile && (
          <section>
            <SectionHeader>Creator Profile</SectionHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Badge label="Username" value={ai.profile.username ? `@${ai.profile.username}` : null} />
              <Badge label="Display Name" value={ai.profile.displayName} />
              <Badge label="Followers" value={ai.profile.followers?.toLocaleString() ?? null} />
              <Badge label="Following" value={ai.profile.following?.toLocaleString() ?? null} />
              <Badge label="Total Likes" value={ai.profile.totalLikes?.toLocaleString() ?? null} />
              <Badge
                label="Verified"
                value={ai.profile.verified ? "Yes" : "No"}
                highlight={ai.profile.verified ? "green" : "none"}
              />
              <Badge label="Region" value={ai.profile.region} />
              <Badge label="Language" value={ai.profile.language} />
              {ai.profile.bio && (
                <div className="col-span-full border border-zinc-800 p-3">
                  <p className="text-zinc-600 text-xs uppercase tracking-widest mb-1">Bio</p>
                  <p className="text-zinc-300 text-sm">{ai.profile.bio}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Section 4: School Analysis ── */}
        {ai && (
          <section>
            <SectionHeader>School Analysis</SectionHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Badge
                label="Primary Targeted School"
                value={ai.targetSchool ?? "None detected"}
                highlight={ai.targetSchool ? "red" : "none"}
              />
              <Badge label="Detected Location" value={ai.location ?? investigation.detectedLocation ?? null} />
              {ai.mentionedSchools?.length > 0 && (
                <div className="col-span-full border border-zinc-800 p-3">
                  <p className="text-zinc-600 text-xs uppercase tracking-widest mb-2">Mentioned Schools</p>
                  <div className="space-y-1">
                    {ai.mentionedSchools.map((s) => (
                      <p key={s} className="text-zinc-300 text-sm">— {s}</p>
                    ))}
                  </div>
                </div>
              )}
              {ai.detectedStudents?.length > 0 && (
                <div className="col-span-full border border-zinc-800 p-3">
                  <p className="text-zinc-600 text-xs uppercase tracking-widest mb-2">Detected Individuals</p>
                  <div className="space-y-1">
                    {ai.detectedStudents.map((s) => (
                      <p key={s} className="text-zinc-300 text-sm">— {s}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Section 5: AI Assessment ── */}
        {ai && (
          <section>
            <SectionHeader>AI Assessment</SectionHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              <Badge
                label="Severity"
                value={ai.severity?.toUpperCase()}
                highlight={severityColor}
              />
              <Badge label="Risk Score" value={`${ai.severityScore}/100`} highlight={severityColor} />
              <Badge label="Confidence" value={`${ai.confidence}%`} />
              <Badge label="Sentiment" value={ai.sentiment} />
              <Badge
                label="Immediate Review"
                value={ai.requiresImmediateReview ? "REQUIRED" : "Not Required"}
                highlight={ai.requiresImmediateReview ? "red" : "none"}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <BooleanFlag label="Cyberbullying" value={ai.containsBullying} />
              <BooleanFlag label="Harassment" value={ai.containsHarassment} />
              <BooleanFlag label="Threats" value={ai.containsThreat} />
              <BooleanFlag label="Incitement" value={ai.containsIncitement} />
              <BooleanFlag label="Hate Speech" value={ai.containsHateSpeech} />
              <BooleanFlag label="Defamation" value={ai.containsDefamation} />
              <BooleanFlag label="Reputation Damage" value={ai.reputationDamage} />
            </div>
          </section>
        )}

        {/* ── Section 6: AI Summary ── */}
        {ai?.summary && (
          <section>
            <SectionHeader>AI Summary</SectionHeader>
            <div className="border border-zinc-800 p-4">
              <p className="text-zinc-200 text-sm leading-relaxed">{ai.summary}</p>
            </div>
          </section>
        )}

        {/* ── Section 7: Detailed Analysis ── */}
        {ai?.explanation && (
          <section>
            <SectionHeader>Detailed Analysis</SectionHeader>
            <div className="border border-zinc-800 p-4">
              <p className="text-zinc-300 text-sm leading-loose whitespace-pre-wrap">{ai.explanation}</p>
            </div>
          </section>
        )}

        {/* ── Section 8: Evidence ── */}
        {ai?.evidence && ai.evidence.length > 0 && (
          <section>
            <SectionHeader>Evidence ({ai.evidence.length} items)</SectionHeader>
            <div className="space-y-1.5">
              {ai.evidence.map((item, i) => (
                <div key={i} className="flex gap-3 border border-zinc-900 px-4 py-3">
                  <span className="text-zinc-700 shrink-0 text-xs mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-zinc-300 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Section 9: Recommended Action ── */}
        {ai?.recommendation && (
          <section>
            <SectionHeader>Recommended Administrative Action</SectionHeader>
            <div className="border border-l-2 border-l-white border-zinc-800 p-4">
              <p className="text-white text-sm leading-relaxed font-semibold">{ai.recommendation}</p>
            </div>
          </section>
        )}

        {/* ── Section 10: Investigation Timeline ── */}
        {events.length > 0 && (
          <section>
            <SectionHeader>Investigation Timeline ({events.length} events)</SectionHeader>
            <div className="space-y-px">
              {events.map((event) => (
                <div key={event.id} className="flex gap-4 border border-zinc-900 px-4 py-2.5">
                  <span className="text-zinc-700 shrink-0 text-xs w-20">
                    {event.createdAt.toLocaleTimeString("en-GB")}
                  </span>
                  {event.progress !== null && (
                    <span className="text-zinc-600 shrink-0 text-xs w-8">{event.progress}%</span>
                  )}
                  <span className={`text-xs ${
                    event.description?.startsWith("✓")
                      ? "text-green-400"
                      : event.description?.startsWith("✕")
                      ? "text-red-400"
                      : event.description?.startsWith("⚠")
                      ? "text-yellow-400"
                      : "text-zinc-400"
                  }`}>
                    {event.description}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Section 11: Investigation Metadata ── */}
        <section>
          <SectionHeader>Investigation Metadata</SectionHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Badge label="Gemini Model" value={ai?.geminiModel ?? "gemini-2.0-flash"} />
            <Badge label="Metadata Provider" value="Apify" />
            <Badge label="Comments Retrieved" value={ai?.commentsRetrieved ?? 0} />
            <Badge label="Evidence Items" value={evidence.length} />
            <Badge label="Timeline Events" value={events.length} />
            <Badge label="Processing Time" value={processingTime} />
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 px-8 py-4 text-center">
        <p className="font-mono text-xs text-zinc-700">
          OVERWATCH · Digital Forensic Report · Generated {new Date().toLocaleString("en-GB")} ·
          This report was produced by AI and must be reviewed by a qualified administrator before any disciplinary action is taken.
        </p>
      </footer>
    </main>
  );
}
