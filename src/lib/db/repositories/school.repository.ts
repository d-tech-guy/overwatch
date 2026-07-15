import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

export class SchoolRepository {
  static async findById(id: string) {
    return prisma.school.findUnique({
      where: { id },
    });
  }

  static async create(data: Prisma.SchoolCreateInput) {
    return prisma.school.create({ data });
  }
}
