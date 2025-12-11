import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

export interface Participant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  participants: Participant[] = [];
  currentUser = '';
  isAdmin = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    const user = this.authService.getCurrentUser();
    this.currentUser = user?.fullName || '';
    this.isAdmin = this.authService.isAdmin();
    this.load();
  }

  load() {
    this.loading = true;
    this.apiService.getParticipants().subscribe({
      next: (data) => {
        this.participants = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  remove(id: string) {
    if (!confirm('Hapus peserta ini?')) return;
    this.apiService.deleteParticipant(id).subscribe({
      next: () => {
        alert('✅ Peserta berhasil dihapus!');
        this.load();
      },
      error: (err) => {
        const errMsg = err.error?.error || 'Gagal menghapus peserta';
        alert('❌ ' + errMsg);
      }
    });
  }

  edit(id: string) {
    this.router.navigate(['/edit-peserta', id]);
  }

  goAdd() {
    this.router.navigate(['/tambah-peserta']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
