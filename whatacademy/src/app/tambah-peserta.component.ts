import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';

@Component({
  selector: 'app-tambah-peserta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tambah-peserta.component.html',
  styleUrls: ['./tambah-peserta.component.css']
})
export class TambahPesertaComponent {
  name = '';
  email = '';
  phone = '';
  error = '';
  loading = false;

  constructor(private apiService: ApiService, private router: Router) {}

  submit() {
    this.error = '';
    this.loading = true;
    
    if (!this.name.trim()) {
      this.error = 'Nama tidak boleh kosong';
      this.loading = false;
      return;
    }
    
    this.apiService.addParticipant(
      this.name.trim(),
      this.email.trim(),
      this.phone.trim()
    ).subscribe({
      next: () => {
        alert('✅ Peserta berhasil ditambahkan!');
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        alert('❌ ' + (err.error?.error || 'Gagal menambah peserta'));
        this.error = err.error?.error || 'Gagal menambah peserta';
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
