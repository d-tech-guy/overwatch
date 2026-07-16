import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: `Access Denied | ${APP_NAME}`,
};

export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center py-24 px-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.svg"
            width={180}
            height={45}
            alt={`${APP_NAME} logotype`}
            priority
            className="mb-6"
          />
          <h1 className="font-mono text-xl font-bold text-red-500 tracking-tight uppercase text-center">
            Access Denied
          </h1>
        </div>

        <div className="bg-black border border-red-900/50 p-8 flex flex-col gap-6">
          <div className="space-y-4">
            <p className="text-zinc-400 font-mono text-sm leading-relaxed text-center">
              You do not have permission to access the requested resource.
            </p>
            <p className="text-zinc-500 font-mono text-xs leading-relaxed text-center">
              Your account may be suspended, or you may lack the necessary privileges.
            </p>
          </div>
          
          <div className="pt-4 border-t border-zinc-900 flex justify-center">
            <Link 
              href="/auth/login"
              className="text-white hover:text-zinc-300 font-mono text-sm uppercase tracking-widest transition-colors"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
