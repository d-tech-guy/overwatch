import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

export class InvestigationEventRepository {
  static async findByInvestigationId(investigationId: string) {
    return prisma.investigationEvent.findMany({
      where: { investigationId },
      orderBy: { createdAt: "asc" },
    });
  }

  static async create(data: Prisma.InvestigationEventCreateInput) {
    return prisma.investigationEvent.create({ data });
  }
}
