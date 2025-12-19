const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "whatacademy",
};

async function migrateData() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL");

    const usersFile = path.join(__dirname, "data", "users.json");
    if (fs.existsSync(usersFile)) {
      const users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
      for (const [key, user] of Object.entries(users)) {
        try {
          await connection.execute(
            "INSERT INTO users (username, email, fullName, password, phone, role, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
              user.username,
              user.email,
              user.fullName,
              user.password,
              user.phone,
              user.role,
              new Date(user.createdAt),
            ]
          );
          console.log(`Migrated user: ${user.username}`);
        } catch (error) {
          if (error.code === "ER_DUP_ENTRY") {
            console.log(`User ${user.username} already exists, skipping`);
          } else {
            throw error;
          }
        }
      }
    }

    const participantsFile = path.join(__dirname, "data", "participants.json");
    if (fs.existsSync(participantsFile)) {
      const participants = JSON.parse(
        fs.readFileSync(participantsFile, "utf-8")
      );
      for (const participant of participants) {
        try {
          await connection.execute(
            "INSERT INTO participants (name, email, phone, createdAt) VALUES (?, ?, ?, ?)",
            [
              participant.name,
              participant.email,
              participant.phone,
              new Date(participant.createdAt),
            ]
          );
          console.log(`Migrated participant: ${participant.name}`);
        } catch (error) {
          console.log(
            `Error migrating participant ${participant.name}:`,
            error.message
          );
        }
      }
    }

    console.log("Migration completed");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    if (connection) await connection.end();
  }
}

migrateData();
