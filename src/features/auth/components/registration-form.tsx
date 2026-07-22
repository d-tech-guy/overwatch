"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitApplication } from "@/actions/applications";
import { applicationSchema } from "@/lib/validators";

export function RegistrationForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Client side validation
    const data = {
      institutionName: formData.get("institutionName"),
      institutionType: formData.get("institutionType"),
      officialEmail: formData.get("officialEmail"),
      website: formData.get("website") || undefined,
      address: formData.get("address") || undefined,
      city: formData.get("city") || undefined,
      state: formData.get("state") || undefined,
      country: formData.get("country"),
      schoolPhone: formData.get("schoolPhone") || undefined,
      administratorName: formData.get("administratorName"),
      administratorPosition: formData.get("administratorPosition"),
      administratorEmail: formData.get("administratorEmail"),
      administratorPhone: formData.get("administratorPhone"),
      reason: formData.get("reason"),
      agreeToTerms: formData.get("agreeToTerms") === "true",
    };

    const validation = applicationSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const result = await submitApplication(formData);
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result?.publicId) {
        router.push(`/auth/pending?id=${result.publicId}&institutionName=${encodeURIComponent(data.institutionName as string)}`);
      }
    } catch {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      
      {/* Institution Details */}
      <div className="space-y-4">
        <h3 className="font-mono text-sm uppercase tracking-widest text-zinc-300 border-b border-zinc-800 pb-2">
          1. Institution Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="institutionName" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Institution Name *
            </label>
            <input
              id="institutionName" name="institutionName" type="text" required
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="institutionType" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Institution Type *
            </label>
            <select
              id="institutionType" name="institutionType" required defaultValue=""
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm h-[38px] appearance-none"
              disabled={isLoading}
            >
              <option value="" disabled>Select type...</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Government">Government / LEA</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="officialEmail" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Official Contact Email *
            </label>
            <input
              id="officialEmail" name="officialEmail" type="email" required
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="schoolPhone" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Official Phone
            </label>
            <input
              id="schoolPhone" name="schoolPhone" type="tel"
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="website" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Institution Website
            </label>
            <input
              id="website" name="website" type="url" placeholder="https://"
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="address" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Address
            </label>
            <input
              id="address" name="address" type="text"
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="city" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              City
            </label>
            <input
              id="city" name="city" type="text"
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="state" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              State / Province
            </label>
            <input
              id="state" name="state" type="text"
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="country" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Country *
            </label>
            <input
              id="country" name="country" type="text" required
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Administrator Details */}
      <div className="space-y-4">
        <h3 className="font-mono text-sm uppercase tracking-widest text-zinc-300 border-b border-zinc-800 pb-2">
          2. Primary Administrator
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="administratorName" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Full Name *
            </label>
            <input
              id="administratorName" name="administratorName" type="text" required
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="administratorPosition" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Job Title / Position *
            </label>
            <input
              id="administratorPosition" name="administratorPosition" type="text" required
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="administratorEmail" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Direct Email *
            </label>
            <input
              id="administratorEmail" name="administratorEmail" type="email" required
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="administratorPhone" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Direct Phone *
            </label>
            <input
              id="administratorPhone" name="administratorPhone" type="tel" required
              className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
      
      {/* Request Details */}
      <div className="space-y-4">
        <h3 className="font-mono text-sm uppercase tracking-widest text-zinc-300 border-b border-zinc-800 pb-2">
          3. Verification
        </h3>
        
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reason" className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            Reason for Requesting Access *
          </label>
          <textarea
            id="reason" name="reason" required rows={4}
            className="py-2 px-3 bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 rounded-none font-mono text-sm resize-none"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-start gap-3 mt-4">
          <input 
            type="checkbox" id="agreeToTerms" name="agreeToTerms" value="true" required
            className="mt-1 bg-zinc-900 border-zinc-800"
            disabled={isLoading}
          />
          <label htmlFor="agreeToTerms" className="font-mono text-xs text-zinc-400 leading-relaxed cursor-pointer">
            I certify that the information provided is accurate and that I am an authorized representative of the institution. I understand that OverWatch access is subject to manual verification.
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-900 p-3 mt-2">
          <p className="text-red-400 text-xs font-mono">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 uppercase text-black bg-white hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed py-3 px-6 font-bold tracking-widest rounded-none transition-colors font-mono text-sm w-full"
      >
        {isLoading ? "Submitting Application..." : "Submit for Verification"}
      </button>
    </form>
  );
}
