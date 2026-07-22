"use server";

import { revalidatePath } from "next/cache";
import { ApplicationRepository } from "@/lib/db/repositories/application.repository";
import { applicationSchema, approvalSchema, rejectionSchema } from "@/lib/validators";
import { createServiceClient } from "@/lib/supabase/service";
import { prisma } from "@/lib/db/prisma";

export async function submitApplication(formData: FormData) {
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
    return { error: validation.error.issues[0].message };
  }

  try {
    const { agreeToTerms, ...applicationData } = validation.data;
    void agreeToTerms;
    const application = await ApplicationRepository.create(applicationData);
    
    return { id: application.id, publicId: application.publicId };
  } catch (error) {
    console.error("[submitApplication] Error:", error);
    return { error: "Failed to submit application. Please try again." };
  }
}

export async function approveApplication(applicationId: string, reviewerId: string) {
  const validation = approvalSchema.safeParse({ applicationId });
  if (!validation.success) return { error: "Invalid application ID." };

  try {
    const finalReviewerId = await resolveReviewerId(reviewerId);

    const app = await ApplicationRepository.findById(applicationId);
    if (!app) return { error: "Application not found." };
    if (app.status !== "pending") return { error: "Application is not pending." };

    const supabaseAdmin = createServiceClient();
    
    // 1. Create Supabase Auth User with fixed temporary password
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: app.administratorEmail,
      email_confirm: true,
      password: "OVW-26-4K9M-XP7A",
      user_metadata: {
        full_name: app.administratorName,
        role: "school_admin",
      },
    });

    if (authError) {
      console.error("[approveApplication] Supabase auth error:", authError);
      return { error: `Failed to create auth user: ${authError.message}` };
    }

    if (!authUser.user) {
      return { error: "Failed to create auth user." };
    }

    // 2. Transaction: Create School, Create Admin, Update Application, Audit Log
    await prisma.$transaction(async (tx) => {
      const school = await tx.school.create({
        data: {
          name: app.institutionName,
          country: app.country,
          state: app.state,
          approved: true,
        }
      });

      const admin = await tx.admin.create({
        data: {
          id: authUser.user.id,
          fullName: app.administratorName,
          email: app.administratorEmail,
          schoolId: school.id,
          role: "school_admin",
        }
      });

      await tx.application.update({
        where: { id: app.id },
        data: {
          status: "approved",
          approvedBy: finalReviewerId,
          approvedAt: new Date(),
          schoolId: school.id,
          adminUserId: admin.id,
        }
      });

      await tx.auditLog.create({
        data: {
          entityType: "application",
          entityId: app.id,
          action: "approved",
          previousStatus: "pending",
          newStatus: "approved",
          performedBy: finalReviewerId,
        }
      });
    });
    
    revalidatePath("/god/applications");
    return { success: true };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    console.error(`[approveApplication] Transaction failed for App ${applicationId}:`, reason);
    return { error: `An unexpected error occurred during approval: ${reason}` };
  }
}

export async function rejectApplication(applicationId: string, reviewerId: string, reason: string) {
  const validation = rejectionSchema.safeParse({ applicationId, reason });
  if (!validation.success) return { error: validation.error.issues[0].message };

  try {
    const finalReviewerId = await resolveReviewerId(reviewerId);

    const app = await ApplicationRepository.findById(applicationId);
    if (!app) return { error: "Application not found." };
    if (app.status !== "pending") return { error: "Application is not pending." };

    await prisma.$transaction(async (tx) => {
      await tx.application.update({
        where: { id: applicationId },
        data: {
          status: "rejected",
          rejectedBy: finalReviewerId,
          rejectedAt: new Date(),
          rejectionReason: reason,
        }
      });

      await tx.auditLog.create({
        data: {
          entityType: "application",
          entityId: app.id,
          action: "rejected",
          previousStatus: "pending",
          newStatus: "rejected",
          performedBy: finalReviewerId,
          reason,
        }
      });
    });

    revalidatePath("/god/applications");
    return { success: true };
  } catch (error) {
    const reasonMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[rejectApplication] Transaction failed for App ${applicationId}:`, reasonMsg);
    return { error: `Failed to reject application: ${reasonMsg}` };
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function resolveReviewerId(reviewerId: string): Promise<string> {
  if (reviewerId === "GOD_CONSOLE_USER") {
    const godEmail = process.env.GOD_EMAIL;
    if (godEmail) {
      const godUser = await prisma.admin.findFirst({
        where: { email: godEmail, role: "platform_admin" }
      });
      if (godUser) return godUser.id;
    }
    throw new Error("Platform Administrator record not found. Please log in again.");
  }
  return reviewerId;
}
