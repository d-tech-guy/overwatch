
export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <div className="space-y-8 max-w-7xl font-mono text-zinc-300">
      <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white capitalize">applications</h2>
          <p className="text-zinc-500 mt-2 text-sm font-semibold tracking-widest uppercase">System applications data</p>
        </div>
      </div>
      <div className="border border-zinc-800 bg-zinc-950 p-8 text-center text-zinc-500 uppercase tracking-widest text-sm">
        No active records found.
      </div>
    </div>
  );
}
