import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',

  // Pilih salah satu:
  // 1) Kalau kamu tidak punya app.css, COMMENT/HAPUS baris ini
  // styleUrls: ['./app.css'],

  // 2) Kalau mau tetap pakai, pastikan file src/app/app.css benar-benar ada
})
export class App implements OnInit {
  protected readonly title = signal('whatacademy');

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    if (
      !localStorage.getItem('participants') &&
      !localStorage.getItem('whatacademy_participants')
    ) {
      const participants = [
        { id: '1', name: 'Ahmad Rizki', email: 'ahmad@example.com', phone: '08123456789' },
        { id: '2', name: 'Siti Nurhaliza', email: 'siti@example.com', phone: '08234567890' },
        { id: '3', name: 'Budi Santoso', email: 'budi@example.com', phone: '08345678901' },
      ];
      localStorage.setItem('participants', JSON.stringify(participants));
      localStorage.setItem('whatacademy_participants', JSON.stringify(participants));
    }

    if (!localStorage.getItem('kelas_list')) {
      const classes = [
        {
          id: '1',
          namaKelas: 'English Basics A',
          level: 'Beginner',
          jadwal: 'Senin & Rabu, 09:00',
          instruktur: 'Mr. John',
          kapasitas: 15,
        },
        {
          id: '2',
          namaKelas: 'English Basics B',
          level: 'Beginner',
          jadwal: 'Selasa & Kamis, 09:00',
          instruktur: 'Ms. Emily',
          kapasitas: 15,
        },
        {
          id: '3',
          namaKelas: 'Intermediate English',
          level: 'Intermediate',
          jadwal: 'Senin & Rabu, 13:00',
          instruktur: 'Ms. Sarah',
          kapasitas: 12,
        },
      ];
      localStorage.setItem('kelas_list', JSON.stringify(classes));
    }

    if (!localStorage.getItem('pembayaran_list')) {
      const payments = [
        {
          id: '1',
          peserta: 'Ahmad Rizki',
          jumlah: 1500000,
          metode: 'Transfer Bank',
          status: 'Lunas',
          tanggal: '2024-01-15',
        },
        {
          id: '2',
          peserta: 'Siti Nurhaliza',
          jumlah: 2000000,
          metode: 'E-Wallet',
          status: 'Lunas',
          tanggal: '2024-01-20',
        },
        {
          id: '3',
          peserta: 'Budi Santoso',
          jumlah: 1250000,
          metode: 'Cash',
          status: 'Belum Lunas',
          tanggal: '2024-02-01',
        },
      ];
      localStorage.setItem('pembayaran_list', JSON.stringify(payments));
    }
  }

  get currentUserData() {
    const raw = localStorage.getItem('currentUserData');
    return raw ? JSON.parse(raw) : null;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserData');
    this.router.navigate(['/login']);
  }
}
