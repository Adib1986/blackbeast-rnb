const path = require("path");
const Database = require("better-sqlite3");
require("dotenv").config();

function createId() {
  return (
    "cat_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 10)
  );
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL fehlt in .env");
}

const sqlitePath = databaseUrl.replace("file:", "");
const absolutePath = path.resolve(process.cwd(), sqlitePath);

console.log("Benutze Datenbank:", absolutePath);

const db = new Database(absolutePath);

const categories = [
  { name: "RNB Talk", slug: "rnb-talk" },
  { name: "Music Production", slug: "music-production" },
  { name: "Member Tracks", slug: "member-tracks" },
  { name: "Collabs", slug: "collabs" },
  { name: "Off Topic", slug: "off-topic" },
];

const findStmt = db.prepare(`
  SELECT id FROM Category WHERE slug = ?
`);

const insertStmt = db.prepare(`
  INSERT INTO Category (id, name, slug, createdAt)
  VALUES (?, ?, ?, ?)
`);

for (const category of categories) {
  const existing = findStmt.get(category.slug);

  if (!existing) {
    insertStmt.run(
      createId(),
      category.name,
      category.slug,
      new Date().toISOString()
    );
  }
}

console.log("Forum categories created successfully.");

db.close();