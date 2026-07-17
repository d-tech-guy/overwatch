import { redirect } from "next/navigation";
import { logout } from "@/actions/auth";

export async function GET() {
  await logout();
  redirect("/auth/login");
}

export async function POST() {
  await logout();
  redirect("/auth/login");
}
