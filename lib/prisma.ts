import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in .env");
}

const sqlitePath = databaseUrl.replace("file:", "");
const absolutePath = path.resolve(process.cwd(), sqlitePath);

const adapter = new PrismaBetterSqlite3({
  url: `file:${absolutePath}`,
});

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}