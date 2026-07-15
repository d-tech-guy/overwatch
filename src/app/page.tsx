import Image from "next/image";
import Link from "next/link";
import { IncidentReportingForm } from "@/components/incident-reporting-form";
import { APP_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Top bar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-900">
        <Image
          src="/logo.svg"
          width={152}
          height={38}
          alt={`${APP_NAME} logotype`}
          priority
        />
        <Link
          href="/auth/login"
          className="font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          Administrator Login
        </Link>
      </nav>

      {/* Reporting terminal */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 gap-12">
        <div className="text-center space-y-3 max-w-lg">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Public Reporting Terminal
          </p>
          <h1 className="font-mono text-3xl font-semibold text-white leading-tight">
            Report a Cyberbullying Incident
          </h1>
          <p className="font-mono text-sm text-zinc-400 leading-relaxed">
            Submit a public TikTok URL to open an AI-assisted investigation.
            No account required. Reports are reviewed by school administrators.
          </p>
        </div>

        <IncidentReportingForm />

        <p className="font-mono text-xs text-zinc-600 text-center max-w-sm">
          All submissions are handled securely. Only submit URLs to publicly
          accessible TikTok posts. Anonymous submissions are accepted.
        </p>
      </section>
    </main>
  );
}
