import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { XCircle, ArrowLeft } from "lucide-react";

export const metadata = {
  title: `Application Rejected | ${APP_NAME}`,
};

export default function RejectedPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8 bg-black border border-red-900/50 p-8 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 p-8 opacity-10 text-red-500 pointer-events-none">
          <XCircle size={120} strokeWidth={1} />
        </div>

        <div className="flex flex-col items-center gap-4 text-center relative z-10">
          <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-900/50 flex items-center justify-center text-red-500">
            <XCircle size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-mono text-xl font-bold text-red-500 tracking-tight uppercase mb-2">
              Access Denied
            </h1>
            <p className="font-mono text-sm text-zinc-400 leading-relaxed">
              Your institution&apos;s application to access the {APP_NAME} Operations Center has been rejected.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-2 relative z-10">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Status</span>
            <span className="font-mono text-xs uppercase tracking-widest text-red-500 font-bold">Rejected</span>
          </div>
          <p className="font-mono text-xs text-zinc-400 pt-1">
            Access to the intelligence platform is strictly limited to verified educational institutions and law enforcement agencies.
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          <p className="font-mono text-xs text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
            If you believe this is an error, please contact your district administration or local law enforcement liaison.
          </p>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full uppercase text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 py-3 px-6 font-bold tracking-widest rounded-none transition-colors font-mono text-sm"
          >
            <ArrowLeft size={16} /> Return to Public Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
