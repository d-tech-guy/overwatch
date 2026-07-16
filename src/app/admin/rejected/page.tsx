"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function RejectedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  
  return (
    <main className="min-h-screen bg-black flex flex-col items-center py-24 px-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.svg"
            width={180}
            height={45}
            alt={`${APP_NAME} logotype`}
            priority
            className="mb-6"
          />
          <h1 className="font-mono text-xl font-bold text-red-500 tracking-tight uppercase text-center">
            Verification Rejected
          </h1>
        </div>

        <div className="bg-black border border-red-900/50 p-8 flex flex-col gap-6">
          <div className="border border-red-900/50 bg-red-950/20 p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Status</span>
              <span className="text-red-500 font-mono text-xs uppercase tracking-widest font-bold">Access Denied</span>
            </div>
            {reason && (
              <div className="flex justify-between flex-col gap-2 mt-4 pt-4 border-t border-red-900/30">
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Reason for Rejection</span>
                <span className="text-zinc-300 font-mono text-sm leading-relaxed">{reason}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <p className="text-zinc-400 font-mono text-sm leading-relaxed text-center">
              Your institution verification request has been reviewed and denied by a Platform Administrator.
            </p>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed text-center">
              If you believe this was an error, please contact support or submit a new application with corrected information.
            </p>
          </div>
          
          <div className="pt-4 border-t border-zinc-900 flex justify-center">
            <Link 
              href="/"
              className="text-white hover:text-zinc-300 font-mono text-sm uppercase tracking-widest transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
