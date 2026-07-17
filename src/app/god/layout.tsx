import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import {
  LayoutDashboard,
  Building2,
  FileCheck,
  Users,
  Search as SearchIcon,
  Radar,
  BarChart3,
  Bot,
  Plug,
  Cpu,
  Bell,
  ScrollText,
  ShieldCheck,
  Settings,
  Activity,
  LogOut,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: `GOD Console | ${APP_NAME}`,
};

const navSections = [
  {
    label: "Operations",
    items: [
      { href: "/god", label: "Overview", icon: LayoutDashboard },
      { href: "/god/investigations", label: "Investigations", icon: Radar },
      { href: "/god/raids", label: "Raid Center", icon: Activity },
      { href: "/god/reports", label: "Reports", icon: ScrollText },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/god/institutions", label: "Institutions", icon: Building2 },
      { href: "/god/applications", label: "Applications", icon: FileCheck },
      { href: "/god/admins", label: "Administrators", icon: Users },
      { href: "/god/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/god/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/god/ai", label: "AI Operations", icon: Bot },
      { href: "/god/audit", label: "Audit Logs", icon: ScrollText },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { href: "/god/integrations", label: "Integrations", icon: Plug },
      { href: "/god/jobs", label: "Background Jobs", icon: Cpu },
      { href: "/god/system", label: "System Health", icon: ShieldCheck },
      { href: "/god/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function GodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white font-mono">
      {/* Sidebar */}
      <aside className="w-[260px] border-r border-zinc-800 flex flex-col hidden md:flex shrink-0 bg-zinc-950">
        {/* Brand */}
        <div className="h-[60px] border-b border-zinc-800 flex items-center px-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white" />
            <span className="text-white text-sm font-bold tracking-[0.2em] uppercase">
              GOD Console
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.15em] px-5 mb-1 font-bold">
                {section.label}
              </p>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-5 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors group"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs tracking-wider uppercase">
                      {item.label}
                    </span>
                    <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 bg-white flex items-center justify-center shrink-0">
              <span className="text-black text-[10px] font-bold">PA</span>
            </div>
            <div className="truncate">
              <p className="text-white text-xs font-bold uppercase tracking-wider truncate">
                Platform Admin
              </p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-wider">
                Absolute Authority
              </p>
            </div>
          </div>
          <a
            href="/auth/logout"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] uppercase tracking-wider"
          >
            <LogOut className="w-3 h-3" />
            Disconnect Session
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-[60px] border-b border-zinc-800 flex items-center justify-between px-6 shrink-0 bg-zinc-950">
          {/* Global Search */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 flex-1">
              <SearchIcon className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-600 text-xs tracking-wider">
                Search institutions, investigations, reports...
              </span>
              <span className="ml-auto text-zinc-700 text-[10px] border border-zinc-800 px-1">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-4 ml-4">
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Systems Online
            </div>
            <a
              href="/auth/logout"
              className="flex items-center gap-1.5 text-[10px] uppercase text-zinc-500 hover:text-white transition-colors tracking-wider"
            >
              <LogOut className="w-3 h-3" />
              Disconnect
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-black p-6">{children}</main>
      </div>
    </div>
  );
}
