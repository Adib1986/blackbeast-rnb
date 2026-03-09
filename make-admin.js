const path = require("path");
const Database = require("better-sqlite3");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL fehlt in der .env Datei.");
}

const sqlitePath = databaseUrl.replace("file:", "");
const absolutePath = path.resolve(process.cwd(), sqlitePath);

console.log("Benutze Datenbank:", absolutePath);

const db = new Database(absolutePath);

const email = "test1@test.com";

const stmt = db.prepare(`
  UPDATE User
  SET approved = 1, role = 'ADMIN'
  WHERE email = ?
`);

const result = stmt.run(email);

if (result.changes > 0) {
  console.log("User wurde erfolgreich zu ADMIN gemacht und freigeschaltet.");
} else {
  console.log("Kein User mit dieser E-Mail gefunden.");
}

db.close();