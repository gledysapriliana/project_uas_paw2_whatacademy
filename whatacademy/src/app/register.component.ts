import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  fullName = '';
  phone = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private router: Router, private apiService: ApiService) {}

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    // Validasi
    if (
      !this.username.trim() ||
      !this.email.trim() ||
      !this.password.trim() ||
      !this.fullName.trim()
    ) {
      this.errorMessage = 'Semua field harus diisi!';
      this.loading = false;
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Password dan konfirmasi password tidak cocok!';
      this.loading = false;
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password minimal 6 karakter!';
      this.loading = false;
      return;
    }

    // Register via API
    this.apiService.register(
      this.username.trim(),
      this.email.trim(),
      this.fullName.trim(),
      this.password.trim(),
      this.phone.trim()
    ).subscribe({
      next: () => {
        alert('✅ Pendaftaran berhasil! Silakan login.');
        this.successMessage = 'Pendaftaran berhasil! Redirect ke login...';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        alert('❌ ' + (err.error?.error || 'Registrasi gagal!'));
        this.errorMessage = err.error?.error || 'Registrasi gagal!';
        this.loading = false;
      }
    });
  }
}
