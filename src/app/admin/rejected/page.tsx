import { redirect } from "next/navigation";

export default function OldRejectedRedirect() {
  redirect("/auth/rejected");
}
