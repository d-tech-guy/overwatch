import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: `Administrator Login | ${APP_NAME}`,
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.svg"
            width={180}
            height={45}
            alt={`${APP_NAME} logotype`}
            priority
            className="mb-6"
          />
          <h1 className="font-mono text-xl font-bold text-white tracking-tight uppercase">
            Operations Center
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest text-center">
            Restricted Access
          </p>
        </div>

        <div className="bg-black border border-zinc-800 p-8">
          <LoginForm />
        </div>
        
        <p className="font-mono text-xs text-zinc-700 text-center uppercase tracking-widest">
          {APP_NAME} v1.0.0
        </p>
      </div>
    </main>
  );
}
