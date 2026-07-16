"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useInvestigationContext } from "@/context/investigation-context";

export function IncidentReportingForm() {
  const [url, setUrl] = useState("");
  const { startInvestigation, status } = useInvestigationContext();
  
  const isPending = status !== null && status !== "failed" && status !== "completed";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url || isPending) return;
    
    await startInvestigation(url);
    setUrl(""); // Clear input after submission
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="url" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Target TikTok URL
        </label>
        
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="absolute left-4 text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="url"
            name="tiktokUrl"
            type="url"
            required
            placeholder="https://www.tiktok.com/@username/video/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isPending}
            className="w-full bg-black border border-zinc-800 text-white pl-12 pr-32 py-4 font-mono text-sm focus:outline-none focus:border-zinc-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!url || isPending}
            className="absolute right-2 top-2 bottom-2 bg-white text-black hover:bg-zinc-200 px-6 font-mono text-xs uppercase tracking-widest font-bold transition-colors disabled:opacity-50"
          >
            {isPending ? "Connecting..." : "Initiate"}
          </button>
        </form>
      </div>

      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isPending ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          {isPending ? "Pipeline Active" : "System Ready"}
        </span>
      </div>
    </div>
  );
}
