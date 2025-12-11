# WhatAcademy - Backend & Frontend Setup

## Struktur Aplikasi

```
project_uas_paw2_whatacademy/
├── backend/           (Node.js Express server)
│   ├── data/         (JSON database)
│   ├── server.js
│   └── package.json
└── whatacademy/      (Angular frontend)
    ├── src/
    ├── package.json
    └── angular.json
```

## Cara Menjalankan

### 1. Backend (Node.js Express)

```powershell
# Terminal 1 - Buka folder backend
cd backend

# Jalankan server
npm start
```

Server akan berjalan di `http://localhost:3000`

**API Endpoints:**
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/participants` - Get semua peserta
- `POST /api/participants` - Add peserta baru
- `GET /api/participants/:id` - Get peserta by ID
- `PUT /api/participants/:id` - Update peserta
- `DELETE /api/participants/:id` - Hapus peserta

### 2. Frontend (Angular)

```powershell
# Terminal 2 - Buka folder whatacademy
cd whatacademy

# Install dependencies (jika belum)
npm install

# Jalankan dev server
npm start
```

Frontend akan berjalan di `http://localhost:4200`

## Testing Flow

### 1. Register User Baru
- Buka `http://localhost:4200/register`
- Isi form dengan username, email, password, etc
- Klik "Daftar"
- Jika berhasil, redirect ke login

### 2. Login
- Buka `http://localhost:4200/login`
- Masukkan username dan password
- **Pesan error jika:**
  - Username belum terdaftar: "Pengguna tidak tersedia. Harap registrasi terlebih dahulu."
  - Password salah: "Password salah. Silakan coba lagi."
- Jika benar, masuk ke dashboard

### 3. Dashboard
- Lihat daftar peserta
- Jika admin: bisa tambah, edit, hapus peserta
- Jika user biasa: hanya bisa lihat

## Fitur yang Telah Diimplementasikan

✅ **Authentication:**
- Register user dengan validasi
- Login dengan username & password
- Error handling yang baik

✅ **Database:**
- User data disimpan di `backend/data/users.json`
- Participant data disimpan di `backend/data/participants.json`

✅ **Dashboard:**
- Tampilan berbeda untuk admin dan user biasa
- CRUD peserta (untuk admin)

✅ **Validasi:**
- Username harus unik
- Password minimal 6 karakter
- Semua field wajib diisi pada register

## Troubleshooting

**Port 3000 sudah digunakan?**
- Edit `server.js` di backend, ubah `const PORT = 3000;` ke port lain (misal 5000)
- Update juga URL di `api.service.ts` frontend

**CORS Error?**
- Backend sudah enable CORS untuk localhost

**Database tidak tersimpan?**
- Pastikan folder `backend/data/` sudah ada dan writable

**Angular compilation error?**
- Coba `npm install` ulang di folder whatacademy
