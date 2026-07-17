import { redirect } from "next/navigation";

export default function OldPendingRedirect({
  searchParams,
}: {
  searchParams: { id?: string; institutionName?: string };
}) {
  const query = new URLSearchParams();
  if (searchParams.id) query.set("id", searchParams.id);
  if (searchParams.institutionName) query.set("institutionName", searchParams.institutionName);
  
  const queryString = query.toString() ? `?${query.toString()}` : "";
  redirect(`/auth/pending${queryString}`);
}
