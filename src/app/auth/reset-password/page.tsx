import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: `Reset Passphrase | ${APP_NAME}`,
};

export default function ResetPasswordPage() {
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
            Set New Passphrase
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest text-center">
            Choose a strong passphrase
          </p>
        </div>

        <div className="bg-black border border-zinc-800 p-8">
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="font-mono text-xs uppercase tracking-widest text-zinc-500"
              >
                New Passphrase
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="py-2.5 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 transition-colors rounded-none font-mono text-sm"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="font-mono text-xs uppercase tracking-widest text-zinc-500"
              >
                Confirm Passphrase
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="py-2.5 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 transition-colors rounded-none font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              className="mt-2 uppercase text-black bg-white hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-6 font-bold tracking-widest rounded-none transition-colors font-mono text-sm"
            >
              Update Passphrase
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
