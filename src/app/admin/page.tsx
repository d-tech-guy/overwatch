import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
import { PROCESSING_STATUS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Fetch some basic stats and the latest investigations
  const [totalCount, activeCount, latestInvestigations] = await Promise.all([
    prisma.investigation.count(),
    prisma.investigation.count({
      where: {
        processingStatus: {
          notIn: [PROCESSING_STATUS.completed as import("@prisma/client").ProcessingStatus, PROCESSING_STATUS.failed as import("@prisma/client").ProcessingStatus],
        },
      },
    }),
    prisma.investigation.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { school: true },
    }),
  ]);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Operations Center</h2>
          <p className="text-zinc-400 mt-1 text-sm">Real-time threat intelligence and investigation status.</p>
        </div>
      </div>

      {/* Threat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between">
          <span className="text-zinc-500 text-xs uppercase tracking-widest">Total Scanned</span>
          <span className="text-3xl font-bold mt-4 text-white">{totalCount}</span>
        </div>
        <div className="border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between">
          <span className="text-zinc-500 text-xs uppercase tracking-widest">Active Investigations</span>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-white">{activeCount}</span>
            {activeCount > 0 && <span className="w-2 h-2 bg-yellow-500 rounded-full mb-2 animate-pulse"></span>}
          </div>
        </div>
        <div className="border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between">
          <span className="text-zinc-500 text-xs uppercase tracking-widest">Critical Threats (7d)</span>
          <span className="text-3xl font-bold mt-4 text-red-500">0</span>
        </div>
        <div className="border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between">
          <span className="text-zinc-500 text-xs uppercase tracking-widest">System Status</span>
          <span className="text-xl font-bold mt-4 text-green-400 uppercase tracking-widest">Optimal</span>
        </div>
      </div>

      {/* Latest Investigations */}
      <div>
        <div className="flex justify-between items-end mb-4 border-b border-zinc-800 pb-2">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">Latest Investigations</h3>
          <Link href="/admin/investigations" className="text-xs text-zinc-500 hover:text-white uppercase">View All ›</Link>
        </div>
        
        <div className="border border-zinc-800 bg-black">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-normal">Public ID</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal">Severity</th>
                <th className="px-4 py-3 font-normal">Author</th>
                <th className="px-4 py-3 font-normal">Created</th>
                <th className="px-4 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {latestInvestigations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-600 text-xs uppercase tracking-widest">
                    No investigations found
                  </td>
                </tr>
              ) : (
                latestInvestigations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-4 py-3 text-zinc-300 font-mono text-xs">{inv.publicId.split('-')[0]}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs uppercase px-2 py-1 border ${
                        inv.processingStatus === 'completed' ? 'border-green-900 text-green-400' : 
                        inv.processingStatus === 'failed' ? 'border-red-900 text-red-400' : 
                        'border-yellow-900 text-yellow-400'
                      }`}>
                        {inv.processingStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {inv.severity ? (
                        <span className={`text-xs uppercase font-bold ${
                          inv.severity === 'critical' || inv.severity === 'high' ? 'text-red-400' :
                          inv.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {inv.severity}
                        </span>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{inv.authorUsername ? `@${inv.authorUsername}` : '-'}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs">{inv.createdAt.toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/report/${inv.id}`} className="text-xs uppercase tracking-widest text-white hover:underline">
                        Open
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
