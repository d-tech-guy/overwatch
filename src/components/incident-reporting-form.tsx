"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { TIKTOK_URL_PATTERN } from "@/lib/constants";
import { submitIncident } from "@/actions/incidents";
import { InvestigationTerminalRealtime } from "./investigation-terminal";

// Re-export alias for any code that still imports InvestigationTerminal
export { InvestigationTerminalRealtime as InvestigationTerminal };

const schema = z.string().url().regex(TIKTOK_URL_PATTERN);

export function IncidentReportingForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeInvestigation, setActiveInvestigation] = useState<{
    id: string;
    publicToken: string;
  } | null>(null);

  const isValid = schema.safeParse(url).success;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("url", url);

    try {
      const result = await submitIncident(formData);

      if ("error" in result) {
        setError(result.error);
        setIsLoading(false);
      } else {
        setActiveInvestigation({ id: result.id, publicToken: result.publicToken });
        setIsLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="w-fit mx-auto p-6 bg-zinc-900 border border-zinc-800">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row py-6 gap-4 sm:gap-0">
            <input
              type="text"
              size={40}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              className="py-2.5 px-6 bg-white/10 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-white transition-all rounded-none font-mono"
              placeholder="Paste a tiktok URL"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="uppercase text-black bg-zinc-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-6 font-bold tracking-tight rounded-none transition-colors"
            >
              {isLoading ? "Starting..." : "Report Incident"}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mb-2 text-center">{error}</p>}
          <p className="text-center text-zinc-500 font-mono text-sm">
            Paste a public TikTok URL to begin an AI-assisted investigation.
          </p>
        </form>
      </div>

      {activeInvestigation && (
        <div className="mt-6 max-w-2xl mx-auto">
          <InvestigationTerminalRealtime
            investigationId={activeInvestigation.id}
            publicToken={activeInvestigation.publicToken}
            initialEvents={[]}
            initialStatus="queued"
            initialProgress={0}
            onComplete={(status) => {
              if (status === "completed") {
                router.push(`/report/${activeInvestigation.id}`);
              }
            }}
          />
        </div>
      )}
    </>
  );
}
