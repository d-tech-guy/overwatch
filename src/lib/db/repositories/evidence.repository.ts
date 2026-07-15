import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

export class EvidenceRepository {
  static async findByInvestigationId(investigationId: string) {
    return prisma.evidence.findMany({
      where: { investigationId },
    });
  }

  static async create(data: Prisma.EvidenceCreateInput) {
    return prisma.evidence.create({ data });
  }
}
