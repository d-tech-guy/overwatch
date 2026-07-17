import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const metadata = {
  title: `Application Pending | ${APP_NAME}`,
};

export default function PendingPage({
  searchParams,
}: {
  searchParams: { id?: string; institutionName?: string };
}) {
  const id = searchParams.id || "Unknown ID";
  const name = searchParams.institutionName || "Your Institution";

  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8 bg-black border border-zinc-800 p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
            <ShieldAlert size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-mono text-xl font-bold text-white tracking-tight uppercase mb-2">
              Verification Required
            </h1>
            <p className="font-mono text-sm text-zinc-400 leading-relaxed">
              Your application for <strong className="text-white">{name}</strong> has been received and is currently under manual review.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-2">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-2">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Status</span>
            <span className="font-mono text-xs uppercase tracking-widest text-yellow-500 font-bold">Pending Review</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Reference ID</span>
            <span className="font-mono text-xs text-white">{id.split('-')[0]}</span>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-mono text-xs text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
            You will receive an email once your application has been processed. Access to the Operations Center is restricted until approval.
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
