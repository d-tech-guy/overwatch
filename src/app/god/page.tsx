import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function GodMissionControlPage() {
  const [totalSchools, totalAdmins, totalInvestigations] = await Promise.all([
    prisma.school.count(),
    prisma.admin.count(),
    prisma.investigation.count(),
  ]);

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex justify-between items-end border-b border-red-900/50 pb-4">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tight text-white">Mission Control</h2>
          <p className="text-red-400/80 mt-2 text-sm font-semibold tracking-widest uppercase">Global Platform Overview</p>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-red-900/30 bg-red-950/10 p-5 flex flex-col justify-between">
          <span className="text-red-400/60 text-xs uppercase tracking-widest font-bold">Registered Institutions</span>
          <span className="text-3xl font-bold mt-4 text-white">{totalSchools}</span>
        </div>
        <div className="border border-red-900/30 bg-red-950/10 p-5 flex flex-col justify-between">
          <span className="text-red-400/60 text-xs uppercase tracking-widest font-bold">Administrators</span>
          <span className="text-3xl font-bold mt-4 text-white">{totalAdmins}</span>
        </div>
        <div className="border border-red-900/30 bg-red-950/10 p-5 flex flex-col justify-between">
          <span className="text-red-400/60 text-xs uppercase tracking-widest font-bold">Global Investigations</span>
          <span className="text-3xl font-bold mt-4 text-white">{totalInvestigations}</span>
        </div>
        <div className="border border-red-900/50 bg-red-900/20 p-5 flex flex-col justify-between">
          <span className="text-red-400 text-xs uppercase tracking-widest font-bold">Platform Status</span>
          <span className="text-xl font-bold mt-4 text-red-500 uppercase tracking-widest animate-pulse">Operational</span>
        </div>
      </div>

      {/* Platform Health Strip */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-red-400/80 mb-4">Platform Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {['Database', 'Realtime', 'Gemini', 'Apify Metadata', 'Apify Comments', 'Next.js'].map((service) => (
            <div key={service} className="border border-red-900/30 bg-black p-3 flex flex-col gap-2">
              <span className="text-xs text-red-200/70 uppercase tracking-wider font-semibold truncate">{service}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500"></div>
                <span className="text-xs text-green-500 uppercase tracking-widest">OK</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Investigation Queue */}
      <div>
        <div className="flex justify-between items-end mb-4 border-b border-red-900/30 pb-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-red-400/80">Active Platform Investigations</h3>
        </div>
        
        <div className="border border-red-900/30 bg-black">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-red-950/20 border-b border-red-900/30 text-xs uppercase tracking-wider text-red-400/60">
              <tr>
                <th className="px-4 py-3 font-bold">ID</th>
                <th className="px-4 py-3 font-bold">Institution</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Provider</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900/20">
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-red-900/50 text-xs uppercase tracking-widest font-bold">
                  No active investigations globally
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
