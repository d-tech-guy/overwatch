import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

export class ApplicationRepository {
  // ─── Queries ─────────────────────────────────────────────────────────────

  static async findById(id: string) {
    return prisma.application.findUnique({ where: { id } });
  }

  static async findByPublicId(publicId: string) {
    return prisma.application.findFirst({ where: { publicId } });
  }

  static async findByAdministratorEmail(email: string) {
    return prisma.application.findFirst({
      where: { administratorEmail: email },
      orderBy: { submittedAt: "desc" },
    });
  }

  static async findAll(filters?: { status?: string }) {
    return prisma.application.findMany({
      where: filters?.status ? { status: filters.status } : undefined,
      orderBy: { submittedAt: "desc" },
    });
  }

  static async countByStatus() {
    return prisma.application.groupBy({
      by: ["status"],
      _count: { status: true },
    });
  }

  // ─── Mutations ────────────────────────────────────────────────────────────

  static async create(data: Omit<Prisma.ApplicationCreateInput, "status" | "publicId">) {
    return prisma.application.create({ data });
  }

  static async markApproved(
    id: string,
    reviewerId: string,
    schoolId: string,
    adminUserId: string
  ) {
    return prisma.application.update({
      where: { id },
      data: {
        status: "approved",
        approvedBy: reviewerId,
        approvedAt: new Date(),
        schoolId,
        adminUserId,
        updatedAt: new Date(),
      },
    });
  }

  static async markRejected(id: string, reviewerId: string, reason: string) {
    return prisma.application.update({
      where: { id },
      data: {
        status: "rejected",
        rejectedBy: reviewerId,
        rejectedAt: new Date(),
        rejectionReason: reason,
        updatedAt: new Date(),
      },
    });
  }

  static async markSuspended(id: string, reviewerId: string, reason: string) {
    return prisma.application.update({
      where: { id },
      data: {
        status: "suspended",
        suspendedBy: reviewerId,
        suspendedAt: new Date(),
        suspensionReason: reason,
        updatedAt: new Date(),
      },
    });
  }
}
