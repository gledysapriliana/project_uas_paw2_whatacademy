const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "whatacademy",
};

let db;

async function initializeDatabase() {
  try {
    const tempDb = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await tempDb.execute("CREATE DATABASE IF NOT EXISTS whatacademy");
    await tempDb.end();

    db = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL database");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        fullName VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('user', 'admin') DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tables created or already exist");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

const saveParticipants = (participants) => {
  fs.writeFileSync(participantsFile, JSON.stringify(participants, null, 2));
};

const getUserByUsername = async (username) => {
  const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  return rows[0];
};

const createUser = async (user) => {
  const { username, email, fullName, password, phone, role } = user;
  const [result] = await db.execute(
    "INSERT INTO users (username, email, fullName, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)",
    [username, email, fullName, password, phone, role]
  );
  return result.insertId;
};

const getAllParticipants = async () => {
  const [rows] = await db.execute(
    "SELECT * FROM participants ORDER BY createdAt DESC"
  );
  return rows;
};

const createParticipant = async (participant) => {
  const { name, email, phone } = participant;
  const [result] = await db.execute(
    "INSERT INTO participants (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone]
  );
  return result.insertId;
};

const getParticipantById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM participants WHERE id = ?", [
    id,
  ]);
  return rows[0];
};

const updateParticipant = async (id, participant) => {
  const { name, email, phone } = participant;
  await db.execute(
    "UPDATE participants SET name = ?, email = ?, phone = ? WHERE id = ?",
    [name, email, phone, id]
  );
};

const deleteParticipant = async (id) => {
  await db.execute("DELETE FROM participants WHERE id = ?", [id]);
};

app.post("/api/auth/register", async (req, res) => {
  const { username, email, fullName, password, phone } = req.body;

  const normalizedUsername = username
    ? String(username).trim().toLowerCase()
    : "";

  // Validation
  if (!username || !email || !fullName || !password) {
    return res.status(400).json({ error: "Semua field harus diisi!" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password minimal 6 karakter!" });
  }

  try {
    const existingUser = await getUserByUsername(normalizedUsername);
    if (existingUser) {
      return res.status(400).json({ error: "Username sudah terdaftar!" });
    }

    const userId = await createUser({
      username: String(username).trim(),
      email: String(email).trim(),
      fullName: String(fullName).trim(),
      password: String(password),
      phone: phone ? String(phone).trim() : "",
      role: "user",
    });

    res.status(201).json({
      message: "Registrasi berhasil!",
      user: { username, email, fullName },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username dan password harus diisi!" });
  }

  try {
    const normalizedUsername = String(username).trim().toLowerCase();
    const user = await getUserByUsername(normalizedUsername);

    if (!user) {
      return res.status(401).json({
        error: "Pengguna tidak tersedia. Harap registrasi terlebih dahulu.",
      });
    }

    if (String(user.password) !== String(password)) {
      return res
        .status(401)
        .json({ error: "Password salah. Silakan coba lagi." });
    }

    res.json({
      message: "Login berhasil!",
      user: {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all participants
app.get("/api/participants", async (req, res) => {
  try {
    const participants = await getAllParticipants();
    res.json(participants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/participants", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nama tidak boleh kosong!" });
  }

  try {
    const participantId = await createParticipant({
      name: name.trim(),
      email: email?.trim() || "",
      phone: phone?.trim() || "",
    });

    const participant = await getParticipantById(participantId);
    res
      .status(201)
      .json({ message: "Peserta berhasil ditambahkan!", participant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get participant by ID
app.get("/api/participants/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const participant = await getParticipantById(id);

    if (!participant) {
      return res.status(404).json({ error: "Peserta tidak ditemukan!" });
    }

    res.json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update participant
app.put("/api/participants/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Nama tidak boleh kosong!" });
  }

  try {
    const existing = await getParticipantById(id);
    if (!existing) {
      return res.status(404).json({ error: "Peserta tidak ditemukan!" });
    }

    await updateParticipant(id, {
      name: name.trim(),
      email: email?.trim() || "",
      phone: phone?.trim() || "",
    });

    const updated = await getParticipantById(id);
    res.json({ message: "Peserta berhasil diperbarui!", participant: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete participant
app.delete("/api/participants/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await getParticipantById(id);
    if (!existing) {
      return res.status(404).json({ error: "Peserta tidak ditemukan!" });
    }

    await deleteParticipant(id);
    res.json({ message: "Peserta berhasil dihapus!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server berjalan dengan baik!" });
});

// Start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
  });
