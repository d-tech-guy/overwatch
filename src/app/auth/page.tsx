import { redirect } from "next/navigation";

/**
 * /auth — Redirect to /auth/login
 */
export default function AuthIndexPage() {
  redirect("/auth/login");
}
