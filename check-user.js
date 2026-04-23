const Database = require("better-sqlite3");

// öffnet deine bestehende Datenbank
const db = new Database("dev.db");

// holt alle User
const users = db.prepare("SELECT id, email, username FROM User").all();

// Ausgabe
console.log("USER IN DATABASE:");
console.log(users);