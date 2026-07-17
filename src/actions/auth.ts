"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LoginResult =
  | { success: true; role: "school_admin" | "platform_admin" }
  | { error: string };

export type LogoutResult = { success: true } | { error: string };

// ---------------------------------------------------------------------------
// Login
//
// Full validation pipeline:
//  1. Supabase signInWithPassword
//  2. Fetch Admin record
//  3. Verify Admin is active
//  4. Fetch School record (for school admins)
//  5. Verify School is approved and not suspended
//  6. Write audit log
//  7. Return role so the client can redirect to the correct dashboard
// ---------------------------------------------------------------------------

export async function login(formData: FormData): Promise<LoginResult> {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // 1. Platform Administrator (GOD)
  const godEmail = process.env.GOD_EMAIL;
  const godPassphrase = process.env.GOD_PASSPHRASE;

  if (godEmail && email === godEmail) {
    if (password === godPassphrase) {
      const { createGodSession } = await import("@/lib/god-session");
      await createGodSession();

      // Ensure the Platform Administrator record exists in the database
      let godUser = await prisma.admin.findFirst({
        where: { email: godEmail, role: "platform_admin" }
      });

      if (!godUser) {
        // Seed the platform admin automatically on first successful login
        godUser = await prisma.admin.create({
          data: {
            id: crypto.randomUUID(),
            fullName: "Platform Administrator",
            email: godEmail,
            role: "platform_admin",
            isActive: true,
          }
        });
      }

      // Use the actual DB UUID for the audit log
      await _writeAuditLog(godUser.id, "login", { role: "GOD" });
      
      redirect("/god");
    }
    return { error: "Incorrect email or password." };
  }

  const supabase = await createClient();

  // Step 1 — Supabase authentication
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError || !authData.user) {
    console.error("[auth/login] Supabase auth error:", authError?.message);

    // Write failed login audit log (best-effort — no user ID available)
    await prisma.auditLog.create({
      data: {
        entityType: "auth",
        entityId: "00000000-0000-0000-0000-000000000000",
        action: "login_failed",
        metadata: { email, reason: authError?.message ?? "unknown" },
      },
    });

    const code = authError?.message?.toLowerCase() ?? "";
    if (code.includes("invalid") || code.includes("credentials")) {
      return { error: "Incorrect email or password." };
    }
    if (code.includes("email not confirmed")) {
      return { error: "Email not confirmed. Check your inbox." };
    }
    return { error: "Authentication failed. Please try again." };
  }

  const userId = authData.user.id;

  // Step 2 — Fetch Admin record
  const admin = await prisma.admin.findUnique({
    where: { id: userId },
    include: { school: true },
  });

  if (!admin) {
    // Supabase session exists but no application-level admin record.
    await supabase.auth.signOut();
    return {
      error:
        "Administrator account not found. Contact your platform administrator.",
    };
  }

  // Step 3 — Verify Admin is active
  if (!admin.isActive) {
    await supabase.auth.signOut();
    await _writeAuditLog(userId, "login_denied", { reason: "admin_inactive" });
    return {
      error:
        "Your administrator account has been deactivated. Contact support.",
    };
  }

  // Platform admins bypass school validation
  if (admin.role === "platform_admin") {
    await _writeAuditLog(userId, "login", { role: "platform_admin" });
    return { success: true, role: "platform_admin" };
  }

  // Step 4 — Fetch School record
  if (!admin.school) {
    await supabase.auth.signOut();
    return {
      error: "Institution record not found. Contact your platform administrator.",
    };
  }

  // Step 5a — Verify School is approved
  if (!admin.school.approved) {
    await supabase.auth.signOut();
    await _writeAuditLog(userId, "login_denied", {
      reason: "institution_not_approved",
    });
    return {
      error:
        "Your institution has not yet been approved. Please wait for verification.",
    };
  }

  // Step 5b — Verify School is not suspended
  if (admin.school.suspendedAt) {
    await supabase.auth.signOut();
    await _writeAuditLog(userId, "login_denied", {
      reason: "institution_suspended",
    });
    return {
      error:
        "Your institution access has been suspended. Contact your platform administrator.",
    };
  }

  // Step 6 — Write success audit log
  await _writeAuditLog(userId, "login", { role: "school_admin" });

  return { success: true, role: "school_admin" };
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export async function logout(): Promise<LogoutResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch (err) {
    console.error("[auth/logout] Supabase signOut error:", err);
  }

  // Remove the GOD session if it exists
  const { removeGodSession } = await import("@/lib/god-session");
  await removeGodSession();

  // Forcibly clear any left-over supabase cookies
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  allCookies.forEach(cookie => {
    if (cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token")) {
      cookieStore.delete(cookie.name);
    }
  });

  if (user) {
    await _writeAuditLog(user.id, "logout", {});
  }

  return { success: true };
}

// ---------------------------------------------------------------------------
// Get current session user (server-side)
// ---------------------------------------------------------------------------

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const admin = await prisma.admin.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
      school: {
        select: {
          id: true,
          name: true,
          approved: true,
          suspendedAt: true,
        },
      },
    },
  });

  return admin;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function _writeAuditLog(
  userId: string,
  action: string,
  metadata: Record<string, unknown>
) {
  try {
    await prisma.auditLog.create({
      data: {
        entityType: "auth",
        entityId: userId,
        action,
        performedBy: userId,
        metadata: metadata as any,
      },
    });
  } catch (err) {
    // Audit log failure is non-fatal — log and continue.
    console.error("[auth/audit] Failed to write audit log:", err);
  }
}
