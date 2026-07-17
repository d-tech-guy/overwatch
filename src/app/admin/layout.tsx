import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: `Operations Center | ${APP_NAME}`,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white font-mono">
      {/* Sidebar */}
      <aside className="w-[280px] border-r border-zinc-900 flex flex-col hidden md:flex shrink-0">
        <div className="h-[72px] border-b border-zinc-900 flex items-center px-6">
          <h1 className="text-xl font-bold tracking-tight uppercase text-white">OVERWATCH</h1>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-1 px-4">
          <p className="text-zinc-600 text-xs uppercase tracking-widest px-2 mb-2">SOC Navigation</p>
          <Link href="/admin" className="px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider font-semibold">
            Operations Center
          </Link>
          <Link href="/admin/investigations" className="px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider font-semibold">
            Investigations
          </Link>
          <Link href="/admin/intelligence" className="px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider font-semibold">
            Threat Intelligence
          </Link>
          <Link href="/admin/raid" className="px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider font-semibold">
            Raid Center
          </Link>
          <Link href="/admin/reports" className="px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider font-semibold">
            Reports
          </Link>
        </nav>

        <div className="border-t border-zinc-900 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-800 shrink-0 border border-zinc-700"></div>
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate uppercase">Administrator</p>
              <p className="text-xs text-zinc-500 truncate uppercase">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-[72px] border-b border-zinc-900 flex items-center justify-between px-8 shrink-0 bg-black">
          <div className="flex items-center gap-4">
            <span className="text-zinc-600 text-sm">/</span>
            <span className="text-zinc-400 text-sm uppercase font-semibold">Operations Center</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 uppercase">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Realtime Active
            </div>
            <a href="/auth/logout" className="text-xs uppercase text-zinc-400 hover:text-white">
              Disconnect Session
            </a>
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
