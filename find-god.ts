import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.admin.findMany({
    where: { role: "platform_admin" }
  });
  console.log(JSON.stringify(admins, null, 2));
}

main().finally(() => prisma.$disconnect());
