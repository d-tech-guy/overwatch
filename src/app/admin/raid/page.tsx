"use client";

import { useState } from "react";
import { APP_NAME } from "@/lib/constants";

import { initiateRaidAction } from "@/actions/raid";

export default function RaidCenterPage() {
  const [institution, setInstitution] = useState("");
  const [keywords, setKeywords] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [creators, setCreators] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleStartRaid(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const res = await initiateRaidAction(formData);

    if (res?.error) {
      setResult(`Error: ${res.error}`);
      setIsLoading(false);
      return;
    }

    setResult(`Raid operation successfully initialized. Raid ID: ${res.raidId}. Backend workers are engaging targets.`);
    setIsLoading(false);
    setInstitution("");
    setKeywords("");
    setHashtags("");
    setCreators("");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-tight">Raid Center</h2>
        <p className="text-zinc-400 mt-1 text-sm">Automated intelligence gathering and threat discovery pipeline.</p>
      </div>

      <div className="border border-zinc-800 bg-black p-6">
        <form onSubmit={handleStartRaid} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="institution" className="font-mono text-xs uppercase tracking-widest text-zinc-500 font-bold">
                Target Institution & Aliases (Comma separated)
              </label>
              <input
                id="institution"
                name="institution"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white font-mono text-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500"
                placeholder="UPSS, University Prep Secondary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="keywords" className="font-mono text-xs uppercase tracking-widest text-zinc-500 font-bold">
                Keywords (Comma separated)
              </label>
              <input
                id="keywords"
                name="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white font-mono text-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500"
                placeholder="fight, beef, war, suspend"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="hashtags" className="font-mono text-xs uppercase tracking-widest text-zinc-500 font-bold">
                Target Hashtags (Comma separated)
              </label>
              <input
                id="hashtags"
                name="hashtags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white font-mono text-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500"
                placeholder="upss, schoolbeef"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="creators" className="font-mono text-xs uppercase tracking-widest text-zinc-500 font-bold">
                Target Creators (Comma separated)
              </label>
              <input
                id="creators"
                name="creators"
                value={creators}
                onChange={(e) => setCreators(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 p-3 text-white font-mono text-sm placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500"
                placeholder="user123, anonymous_student"
              />
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4">
            <p className="text-xs text-zinc-400 uppercase leading-relaxed tracking-wider">
              <strong>Warning:</strong> Initiating an intelligence raid will command background workers to scrape TikTok using the provided parameters. High-frequency queries will consume significant API quotas.
            </p>
          </div>

          {result && (
            <div className={`p-4 border text-sm font-mono uppercase tracking-widest ${
              result.startsWith("Error") ? "bg-red-950/20 border-red-900 text-red-400" : "bg-green-950/20 border-green-900 text-green-400"
            }`}>
              {result}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || (!institution && !keywords && !hashtags && !creators)}
              className="bg-white text-black px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Compiling Intelligence..." : "Initiate Intelligence Raid"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-300 mb-4">Active Operations</h3>
        <div className="border border-zinc-800 bg-black">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-normal">Operation ID</th>
                <th className="px-4 py-3 font-normal">Scope</th>
                <th className="px-4 py-3 font-normal">Discovered</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-600 text-xs uppercase tracking-widest">
                  No active raids
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
