import { ApplicationRepository } from "@/lib/db/repositories/application.repository";
import { ApplicationCard } from "@/features/auth/components/application-card";

export const metadata = {
  title: "Applications | GOD Console",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status || "pending";
  const applications = await ApplicationRepository.findAll({ status });
  const counts = await ApplicationRepository.countByStatus();
  
  const pendingCount = counts.find((c) => c.status === "pending")?._count.status || 0;
  const approvedCount = counts.find((c) => c.status === "approved")?._count.status || 0;
  const rejectedCount = counts.find((c) => c.status === "rejected")?._count.status || 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <h1 className="font-mono text-xl font-bold uppercase tracking-widest text-white">Institution Applications</h1>
        <div className="flex gap-4">
          <a href="/god/applications?status=pending" className={`font-mono text-xs uppercase tracking-widest px-3 py-1 ${status === 'pending' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
            Pending ({pendingCount})
          </a>
          <a href="/god/applications?status=approved" className={`font-mono text-xs uppercase tracking-widest px-3 py-1 ${status === 'approved' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
            Approved ({approvedCount})
          </a>
          <a href="/god/applications?status=rejected" className={`font-mono text-xs uppercase tracking-widest px-3 py-1 ${status === 'rejected' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
            Rejected ({rejectedCount})
          </a>
        </div>
      </div>
      
      {applications.length === 0 ? (
        <div className="border border-dashed border-zinc-800 p-12 flex items-center justify-center">
          <p className="font-mono text-sm text-zinc-500 uppercase tracking-widest">No applications found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
