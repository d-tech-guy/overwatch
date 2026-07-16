import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: `GOD Console | ${APP_NAME}`,
};

export default function GodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white font-mono">
      {/* Sidebar */}
      <aside className="w-[280px] border-r border-red-900/50 flex flex-col hidden md:flex shrink-0 bg-black">
        <div className="h-[72px] border-b border-red-900/50 flex items-center px-6 bg-red-950/20">
          <h1 className="text-xl font-bold tracking-tight uppercase text-red-500">GOD CONSOLE</h1>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-1 px-4 overflow-y-auto">
          <p className="text-red-900/80 text-xs uppercase tracking-widest px-2 mb-2 font-bold">Platform Admin</p>
          <Link href="/god" className="px-3 py-2 text-sm text-red-200/70 hover:text-red-400 hover:bg-red-950/30 transition-colors uppercase tracking-wider font-semibold">
            Mission Control
          </Link>
          <Link href="/god/institutions" className="px-3 py-2 text-sm text-red-200/70 hover:text-red-400 hover:bg-red-950/30 transition-colors uppercase tracking-wider font-semibold">
            Institutions
          </Link>
          <Link href="/god/administrators" className="px-3 py-2 text-sm text-red-200/70 hover:text-red-400 hover:bg-red-950/30 transition-colors uppercase tracking-wider font-semibold">
            Administrators
          </Link>
          <Link href="/god/investigations" className="px-3 py-2 text-sm text-red-200/70 hover:text-red-400 hover:bg-red-950/30 transition-colors uppercase tracking-wider font-semibold">
            Investigations
          </Link>
          <Link href="/god/providers" className="px-3 py-2 text-sm text-red-200/70 hover:text-red-400 hover:bg-red-950/30 transition-colors uppercase tracking-wider font-semibold">
            Providers
          </Link>
          <Link href="/god/system" className="px-3 py-2 text-sm text-red-200/70 hover:text-red-400 hover:bg-red-950/30 transition-colors uppercase tracking-wider font-semibold">
            System Health
          </Link>
        </nav>

        <div className="border-t border-red-900/50 p-4 bg-red-950/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-900/30 shrink-0 border border-red-800"></div>
            <div className="truncate">
              <p className="text-sm font-semibold text-red-400 truncate uppercase">Platform Owner</p>
              <p className="text-xs text-red-900/80 truncate uppercase">God Mode</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-[72px] border-b border-red-900/50 flex items-center justify-between px-8 shrink-0 bg-black">
          <div className="flex items-center gap-4">
            <span className="text-red-900/80 text-sm">/</span>
            <span className="text-red-400 text-sm uppercase font-semibold">Mission Control</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs text-red-400/80 uppercase font-bold tracking-widest border border-red-900/50 px-3 py-1 bg-red-950/20">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Absolute Authority
            </div>
            <Link href="/admin" className="text-xs uppercase text-zinc-500 hover:text-white transition-colors">
              Exit God Mode
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-black p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
