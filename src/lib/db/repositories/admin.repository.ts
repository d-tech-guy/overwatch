import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

export class AdminRepository {
  static async findById(id: string) {
    return prisma.admin.findUnique({
      where: { id },
    });
  }

  static async create(data: Prisma.AdminCreateInput) {
    return prisma.admin.create({ data });
  }
}
