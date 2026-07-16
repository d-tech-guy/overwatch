import Link from "next/link";
import { InvestigationRepository } from "@/lib/db/repositories/investigation.repository";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function InvestigationsPage() {
  const investigations = await prisma.investigation.findMany({
    orderBy: { createdAt: "desc" },
    include: { school: true },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight">Investigations</h2>
          <p className="text-zinc-400 mt-1 text-sm">All historical and active threat intelligence reports.</p>
        </div>
      </div>

      <div className="border border-zinc-800 bg-black">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-900 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-normal">ID</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Severity</th>
              <th className="px-4 py-3 font-normal">Confidence</th>
              <th className="px-4 py-3 font-normal">Author</th>
              <th className="px-4 py-3 font-normal">Date</th>
              <th className="px-4 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {investigations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-600 text-xs uppercase tracking-widest">
                  No investigations found
                </td>
              </tr>
            ) : (
              investigations.map((inv) => (
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
                  <td className="px-4 py-3">
                    {inv.confidenceScore ? (
                      <span className="text-zinc-300">{inv.confidenceScore}%</span>
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
  );
}
