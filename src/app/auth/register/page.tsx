import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { RegistrationForm } from "@/features/auth/components/registration-form";

export const metadata = {
  title: `Institution Registration | ${APP_NAME}`,
  description:
    "Register your institution to access the OverWatch Operations Center.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.svg"
            width={180}
            height={45}
            alt={`${APP_NAME} logotype`}
            priority
            className="mb-6"
          />
          <h1 className="font-mono text-xl font-bold text-white tracking-tight uppercase text-center">
            Request Institution Access
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest text-center max-w-md">
            Submit your institution for verification. Access to the Operations
            Center is strictly restricted to verified educational institutions.
          </p>
        </div>

        <div className="bg-black border border-zinc-800 p-8">
          <RegistrationForm />
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/login"
            className="font-mono text-xs text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors"
          >
            ← Back to Login
          </Link>
        </div>

        <p className="font-mono text-xs text-zinc-700 text-center uppercase tracking-widest">
          {APP_NAME} Verification Protocol
        </p>
      </div>
    </main>
  );
}
