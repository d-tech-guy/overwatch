"use client";

import { useState } from "react";
import { approveApplication, rejectApplication } from "@/actions/applications";

// Note: In a real app we'd fetch this server-side, but for now we'll accept props
export function ApplicationCard({ application }: { application: any }) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleApprove() {
    setIsLoading(true);
    setError("");
    const res = await approveApplication(application.id, "GOD_CONSOLE_USER");
    if (res?.error) setError(res.error);
    setIsLoading(false);
  }

  async function handleReject() {
    if (!rejectReason) {
      setError("Please provide a rejection reason.");
      return;
    }
    setIsLoading(true);
    setError("");
    const res = await rejectApplication(application.id, "GOD_CONSOLE_USER", rejectReason);
    if (res?.error) setError(res.error);
    setIsLoading(false);
  }

  return (
    <div className="border border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
        <div>
          <h3 className="text-white font-mono font-bold text-lg">{application.institutionName}</h3>
          <p className="text-zinc-500 font-mono text-xs mt-1">{application.institutionType} • {application.country}</p>
        </div>
        <div className="bg-zinc-900 px-3 py-1 border border-zinc-800 text-xs font-mono text-zinc-400 uppercase">
          {application.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">Administrator</h4>
          <p className="text-zinc-300 font-mono text-sm">{application.administratorName}</p>
          <p className="text-zinc-500 font-mono text-xs">{application.administratorPosition}</p>
          <p className="text-zinc-400 font-mono text-xs mt-1">{application.administratorEmail}</p>
          <p className="text-zinc-400 font-mono text-xs">{application.administratorPhone}</p>
        </div>
        <div>
          <h4 className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">Institution</h4>
          <p className="text-zinc-400 font-mono text-xs">{application.officialEmail}</p>
          <p className="text-zinc-400 font-mono text-xs truncate">{application.website || "No website"}</p>
          <p className="text-zinc-400 font-mono text-xs mt-1">
            {application.address && `${application.address}, `}
            {application.city && `${application.city}, `}
            {application.state}
          </p>
        </div>
      </div>

      <div className="mt-2 border-t border-zinc-900 pt-4">
        <h4 className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-2">Reason for Joining</h4>
        <p className="text-zinc-400 font-mono text-sm leading-relaxed">{application.reason}</p>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-900/50 p-3 mt-2">
          <p className="text-red-400 text-xs font-mono">{error}</p>
        </div>
      )}

      {application.status === "pending" && (
        <div className="mt-4 flex gap-3 pt-4 border-t border-zinc-900">
          {isRejecting ? (
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white p-2 font-mono text-sm focus:outline-none focus:border-zinc-500"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleReject} 
                  disabled={isLoading}
                  className="flex-1 bg-red-950 text-red-500 hover:bg-red-900 hover:text-white uppercase font-mono text-xs tracking-widest py-2 border border-red-900/50 transition-colors"
                >
                  Confirm Reject
                </button>
                <button 
                  onClick={() => setIsRejecting(false)} 
                  disabled={isLoading}
                  className="flex-1 bg-zinc-900 text-zinc-400 hover:text-white uppercase font-mono text-xs tracking-widest py-2 border border-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={handleApprove}
                disabled={isLoading}
                className="flex-1 bg-white text-black hover:bg-zinc-200 uppercase font-mono text-xs tracking-widest py-3 font-bold transition-colors disabled:opacity-50"
              >
                Approve & Create Account
              </button>
              <button 
                onClick={() => setIsRejecting(true)}
                disabled={isLoading}
                className="flex-1 bg-black text-zinc-400 hover:text-red-400 uppercase font-mono text-xs tracking-widest py-3 border border-zinc-800 hover:border-red-900/50 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
