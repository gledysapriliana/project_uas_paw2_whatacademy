import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-peserta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-peserta.component.html',
})
export class EditPesertaComponent implements OnInit {
  name = '';
  email = '';
  phone = '';
  id = '';
  error = '';
  loading = false;
  initialLoading = true;
  success = '';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'] || '';
      console.log('Edit ID:', this.id);
      if (this.id) {
        this.loadParticipant();
      } else {
        this.initialLoading = false;
        this.error = 'ID peserta tidak ditemukan!';
      }
    });
  }

  loadParticipant() {
    console.log('Loading participant with ID:', this.id);
    this.apiService.getParticipant(this.id).subscribe({
      next: (data: any) => {
        console.log('Successfully loaded:', data);
        this.name = data.name || '';
        this.email = data.email || '';
        this.phone = data.phone || '';
        this.error = '';
        this.initialLoading = false;
      },
      error: (err: any) => {
        console.error('Load error:', err);
        const msg = err.error?.error || err.message || 'Gagal memuat peserta';
        this.error = 'Gagal memuat peserta: ' + msg;
        this.initialLoading = false;
        alert('❌ ' + this.error);
        setTimeout(() => this.router.navigate(['/dashboard']), 1400);
      },
    });
  }

  submit() {
    if (!this.name.trim()) {
      this.error = 'Nama tidak boleh kosong';
      return;
    }
    this.error = '';
    this.loading = true;

    this.apiService
      .updateParticipant(this.id, {
        name: this.name.trim(),
        email: this.email.trim(),
        phone: this.phone.trim(),
      })
      .subscribe({
        next: () => {
          alert('✅ Peserta berhasil diperbarui!');
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          const errMsg = err.error?.error || 'Gagal update peserta';
          alert('❌ ' + errMsg);
          this.error = errMsg;
          this.loading = false;
        },
      });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
