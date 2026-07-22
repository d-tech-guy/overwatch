import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: `Forgot Passphrase | ${APP_NAME}`,
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2 z-10">
          <Image
            src="/logo.svg"
            width={180}
            height={45}
            alt={`${APP_NAME} logotype`}
            priority
            className="mb-6"
          />
          <h1 className="font-mono text-xl font-bold text-white tracking-tight uppercase">
            Passphrase Recovery
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest text-center">
            Enter your official institution email
          </p>
        </div>

        <div className="bg-black border border-zinc-800 p-8">
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-mono text-xs uppercase tracking-widest text-zinc-500"
              >
                Administrator Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="py-2.5 px-3 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors rounded-none font-mono text-sm"
                placeholder="admin@school.edu"
              />
            </div>

            <button
              type="submit"
              className="mt-2 uppercase text-black bg-white hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-6 font-bold tracking-widest rounded-none transition-colors font-mono text-sm"
            >
              Request Reset Link
            </button>
          </form>
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 font-mono text-xs text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={14} /> Return to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
