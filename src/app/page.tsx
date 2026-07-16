import { IncidentReportingForm } from "@/components/incident-reporting-form";
import { InvestigationProvider } from "@/context/investigation-context";
import { InvestigationModal } from "@/components/investigation/investigation-modal";
import { BackgroundDock } from "@/components/investigation/background-dock";
import Link from "next/link";
import { ShieldAlert, Fingerprint, Lock, Search } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <InvestigationProvider>
      <main className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Header navigation */}
        <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20 mix-blend-difference">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span className="font-mono text-xs tracking-widest uppercase text-zinc-400">Classified</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Systems Online
            </div>
            <Link 
              href="/auth/login"
              className="text-xs font-mono uppercase tracking-widest hover:text-white text-zinc-400 transition-colors border border-zinc-800 px-4 py-2 hover:bg-zinc-900"
            >
              Operations Center
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center gap-12 pt-16">
          <div className="flex flex-col items-center gap-6 text-center w-full">
            <Image 
              src="/logo.svg" 
              alt="OverWatch" 
              width={280} 
              height={70} 
              priority
              className="mb-4 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            />
            
            <p className="font-mono text-sm md:text-base text-zinc-400 max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
              Cyberbullying Intelligence & Investigation Engine. 
              <br className="hidden sm:block" />
              Restricted to authorized educational institutions.
            </p>
          </div>

          <IncidentReportingForm />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-8">
            <div className="flex flex-col items-center text-center gap-3 p-6 border border-zinc-900 bg-black/50 backdrop-blur-sm">
              <Search className="w-5 h-5 text-zinc-400" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-300">Automated OSINT</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Gather metadata and digital footprints autonomously.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3 p-6 border border-zinc-900 bg-black/50 backdrop-blur-sm">
              <Fingerprint className="w-5 h-5 text-zinc-400" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-300">Threat Assessment</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Analyze behavioral patterns and severity levels.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3 p-6 border border-zinc-900 bg-black/50 backdrop-blur-sm">
              <Lock className="w-5 h-5 text-zinc-400" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-300">Secure Vault</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Evidence is encrypted and preserved for chain of custody.</p>
            </div>
          </div>
        </div>

        {/* Global Modal & Dock */}
        <InvestigationModal />
        <BackgroundDock />
      </main>
    </InvestigationProvider>
  );
}
