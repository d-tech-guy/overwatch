"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function PendingPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const institutionName = searchParams.get("institutionName");
  
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
          <h1 className="font-mono text-xl font-bold text-white tracking-tight uppercase text-center">
            Verification Pending
          </h1>
        </div>

        <div className="bg-black border border-zinc-800 p-8 flex flex-col gap-6">
          <div className="border border-zinc-800 bg-zinc-950 p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Status</span>
              <span className="text-yellow-500 font-mono text-xs uppercase tracking-widest font-bold animate-pulse">Under Review</span>
            </div>
            {id && (
              <div className="flex justify-between">
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Request ID</span>
                <span className="text-zinc-300 font-mono text-xs uppercase tracking-widest">{id.split("-")[0]}</span>
              </div>
            )}
            {institutionName && (
              <div className="flex justify-between">
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Institution</span>
                <span className="text-zinc-300 font-mono text-xs">{institutionName}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <p className="text-zinc-400 font-mono text-sm leading-relaxed text-center">
              Your application has been received and is currently under manual review by a Platform Administrator.
            </p>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed text-center">
              Verification typically takes 24-48 hours. You will receive an email once your institution has been approved.
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
