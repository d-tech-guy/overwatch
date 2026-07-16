"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="py-2.5 px-3 bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors rounded-none font-mono text-sm"
          placeholder="admin@school.edu"
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="font-mono text-xs uppercase tracking-widest text-zinc-500"
        >
          Passphrase
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="py-2.5 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 transition-colors rounded-none font-mono text-sm"
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-900 p-3">
          <p className="text-red-400 text-xs font-mono">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !email || !password}
        className="mt-2 uppercase text-black bg-white hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed py-2.5 px-6 font-bold tracking-widest rounded-none transition-colors font-mono text-sm"
      >
        {isLoading ? "Authenticating..." : "Establish Connection"}
      </button>

      <div className="pt-4 border-t border-zinc-800 flex justify-center mt-2">
        <Link 
          href="/admin/register"
          className="text-zinc-400 hover:text-white text-xs uppercase tracking-widest transition-colors font-mono"
        >
          Register Institution
        </Link>
      </div>
    </form>
  );
}
