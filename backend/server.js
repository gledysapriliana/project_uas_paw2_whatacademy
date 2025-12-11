const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database file
const usersFile = path.join(__dirname, 'data', 'users.json');
const participantsFile = path.join(__dirname, 'data', 'participants.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize database files if not exist
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify({}));
}
if (!fs.existsSync(participantsFile)) {
  fs.writeFileSync(participantsFile, JSON.stringify([]));
}

// Helper functions
const getUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
  } catch {
    return {};
  }
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

const getParticipants = () => {
  try {
    return JSON.parse(fs.readFileSync(participantsFile, 'utf-8'));
  } catch {
    return [];
  }
};

const saveParticipants = (participants) => {
  fs.writeFileSync(participantsFile, JSON.stringify(participants, null, 2));
};

// Routes

// Register
app.post('/api/auth/register', (req, res) => {
  const { username, email, fullName, password, phone } = req.body;

  // Validation
  if (!username || !email || !fullName || !password) {
    return res.status(400).json({ error: 'Semua field harus diisi!' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password minimal 6 karakter!' });
  }

  const users = getUsers();
  if (users[username]) {
    return res.status(400).json({ error: 'Username sudah terdaftar!' });
  }

  // Save user
  users[username] = {
    username,
    email,
    fullName,
    password,
    phone: phone || '',
    role: 'user',
    createdAt: new Date().toISOString()
  };

  saveUsers(users);

  res.status(201).json({ message: 'Registrasi berhasil!', user: { username, email, fullName } });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi!' });
  }

  const users = getUsers();
  const user = users[username];

  if (!user) {
    return res.status(401).json({ error: 'Pengguna tidak tersedia. Harap registrasi terlebih dahulu.' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Password salah. Silakan coba lagi.' });
  }

  res.json({
    message: 'Login berhasil!',
    user: {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  });
});

// Get all participants
app.get('/api/participants', (req, res) => {
  const participants = getParticipants();
  res.json(participants);
});

// Add participant
app.post('/api/participants', (req, res) => {
  const { name, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nama tidak boleh kosong!' });
  }

  const participants = getParticipants();
  const participant = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email?.trim() || '',
    phone: phone?.trim() || '',
    createdAt: new Date().toISOString()
  };

  participants.push(participant);
  saveParticipants(participants);

  res.status(201).json({ message: 'Peserta berhasil ditambahkan!', participant });
});

// Get participant by ID
app.get('/api/participants/:id', (req, res) => {
  const { id } = req.params;
  const participants = getParticipants();
  const participant = participants.find(p => p.id === id);

  if (!participant) {
    return res.status(404).json({ error: 'Peserta tidak ditemukan!' });
  }

  res.json(participant);
});

// Update participant
app.put('/api/participants/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Nama tidak boleh kosong!' });
  }

  const participants = getParticipants();
  const index = participants.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Peserta tidak ditemukan!' });
  }

  participants[index] = {
    ...participants[index],
    name: name.trim(),
    email: email?.trim() || '',
    phone: phone?.trim() || ''
  };

  saveParticipants(participants);

  res.json({ message: 'Peserta berhasil diperbarui!', participant: participants[index] });
});

// Delete participant
app.delete('/api/participants/:id', (req, res) => {
  const { id } = req.params;
  const participants = getParticipants();
  const filtered = participants.filter(p => p.id !== id);

  if (filtered.length === participants.length) {
    return res.status(404).json({ error: 'Peserta tidak ditemukan!' });
  }

  saveParticipants(filtered);

  res.json({ message: 'Peserta berhasil dihapus!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server berjalan dengan baik!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
