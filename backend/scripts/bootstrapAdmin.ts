import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

const requiredVariables = [
  "ADMIN_NAME",
  "ADMIN_USERNAME",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
] as const;

for (const variable of requiredVariables) {
  if (!process.env[variable]?.trim()) {
    throw new Error(`${variable} must be set before bootstrapping the admin account`);
  }
}

const name = process.env.ADMIN_NAME!.trim();
const username = process.env.ADMIN_USERNAME!.trim();
const email = process.env.ADMIN_EMAIL!.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD!;

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);
  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { name, username, email, password: passwordHash, role: "ADMIN" },
    });
  } else {
    await prisma.user.create({
      data: { name, username, email, password: passwordHash, role: "ADMIN" },
    });
  }

  await prisma.user.updateMany({
    where: { role: "ADMIN", NOT: { username } },
    data: { role: "USER" },
  });

  console.log(`Admin account ready: ${username}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });