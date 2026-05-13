import "dotenv/config";
import Database from "better-sqlite3";
import { Pool } from "pg";
import path from "path";
import fs from "fs";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL fehlt in .env");
}

// 👉 WICHTIG: HIER IST JETZT DIE RICHTIGE DB
const sqlitePath = path.join(process.cwd(), "dev.db");

if (!fs.existsSync(sqlitePath)) {
  throw new Error(`Lokale SQLite DB nicht gefunden: ${sqlitePath}`);
}

const sqlite = new Database(sqlitePath, {
  readonly: true,
  fileMustExist: true,
});

const pg = new Pool({
  connectionString: DATABASE_URL,
});

type Row = Record<string, any>;

function all(table: string): Row[] {
  try {
    return sqlite.prepare(`SELECT * FROM ${table}`).all() as Row[];
  } catch {
    return [];
  }
}

async function insertUser(row: Row) {
  await pg.query(
    `
    INSERT INTO "User"
    ("id", "username", "email", "passwordHash", "role", "approved", "isBlocked", "createdAt", "updatedAt")
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT ("id") DO UPDATE SET
      "username" = EXCLUDED."username",
      "email" = EXCLUDED."email",
      "passwordHash" = EXCLUDED."passwordHash",
      "role" = EXCLUDED."role",
      "approved" = EXCLUDED."approved",
      "isBlocked" = EXCLUDED."isBlocked",
      "createdAt" = EXCLUDED."createdAt",
      "updatedAt" = EXCLUDED."updatedAt"
    `,
    [
      row.id,
      row.username,
      row.email,
      row.passwordHash,
      row.role ?? "USER",
      Boolean(row.approved),
      Boolean(row.isBlocked),
      row.createdAt,
      row.updatedAt,
    ]
  );
}

async function insertCategory(row: Row) {
  await pg.query(
    `
    INSERT INTO "Category"
    ("id", "name", "slug", "createdAt")
    VALUES ($1,$2,$3,$4)
    ON CONFLICT ("id") DO UPDATE SET
      "name" = EXCLUDED."name",
      "slug" = EXCLUDED."slug",
      "createdAt" = EXCLUDED."createdAt"
    `,
    [row.id, row.name, row.slug, row.createdAt]
  );
}

async function insertThread(row: Row) {
  await pg.query(
    `
    INSERT INTO "Thread"
    ("id", "title", "content", "createdAt", "categoryId", "authorId")
    VALUES ($1,$2,$3,$4,$5,$6)
    ON CONFLICT ("id") DO UPDATE SET
      "title" = EXCLUDED."title",
      "content" = EXCLUDED."content",
      "createdAt" = EXCLUDED."createdAt",
      "categoryId" = EXCLUDED."categoryId",
      "authorId" = EXCLUDED."authorId"
    `,
    [row.id, row.title, row.content, row.createdAt, row.categoryId, row.authorId]
  );
}

async function insertReply(row: Row) {
  await pg.query(
    `
    INSERT INTO "Reply"
    ("id", "content", "createdAt", "threadId", "authorId")
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT ("id") DO UPDATE SET
      "content" = EXCLUDED."content",
      "createdAt" = EXCLUDED."createdAt",
      "threadId" = EXCLUDED."threadId",
      "authorId" = EXCLUDED."authorId"
    `,
    [row.id, row.content, row.createdAt, row.threadId, row.authorId]
  );
}

async function insertTrack(row: Row) {
  await pg.query(
    `
    INSERT INTO "Track"
    ("id", "title", "fileUrl", "originalName", "createdAt", "authorId")
    VALUES ($1,$2,$3,$4,$5,$6)
    ON CONFLICT ("id") DO UPDATE SET
      "title" = EXCLUDED."title",
      "fileUrl" = EXCLUDED."fileUrl",
      "originalName" = EXCLUDED."originalName",
      "createdAt" = EXCLUDED."createdAt",
      "authorId" = EXCLUDED."authorId"
    `,
    [row.id, row.title, row.fileUrl, row.originalName, row.createdAt, row.authorId]
  );
}

async function main() {
  const users = all("User");
  const categories = all("Category");
  const threads = all("Thread");
  const replies = all("Reply");
  const tracks = all("Track");

  console.log("Gefunden lokal:");
  console.log({
    users: users.length,
    categories: categories.length,
    threads: threads.length,
    replies: replies.length,
    tracks: tracks.length,
  });

  await pg.query("BEGIN");

  try {
    await pg.query(`DELETE FROM "Reply"`);
    await pg.query(`DELETE FROM "Track"`);
    await pg.query(`DELETE FROM "Thread"`);
    await pg.query(`DELETE FROM "Category"`);
    await pg.query(`DELETE FROM "User"`);

    for (const user of users) await insertUser(user);
    for (const category of categories) await insertCategory(category);
    for (const thread of threads) await insertThread(thread);
    for (const reply of replies) await insertReply(reply);
    for (const track of tracks) await insertTrack(track);

    await pg.query("COMMIT");

    console.log("✅ Online-DB wurde erfolgreich gespiegelt.");
  } catch (error) {
    await pg.query("ROLLBACK");
    console.error("❌ Fehler beim Spiegeln.");
    console.error(error);
    process.exit(1);
  } finally {
    sqlite.close();
    await pg.end();
  }
}

main();