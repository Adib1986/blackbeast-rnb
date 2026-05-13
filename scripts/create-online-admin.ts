import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "test1@test.com";
  const username = "test1";
  const password = "123456";

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      username,
      passwordHash,
      role: "ADMIN",
      approved: true,
      isBlocked: false,
    },
    create: {
      email,
      username,
      passwordHash,
      role: "ADMIN",
      approved: true,
      isBlocked: false,
    },
  });

  console.log("ONLINE ADMIN CREATED/UPDATED:");
  console.log({
    email: user.email,
    username: user.username,
    role: user.role,
    approved: user.approved,
    isBlocked: user.isBlocked,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });