import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {}

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validasi
    if (
      !this.username.trim() ||
      !this.email.trim() ||
      !this.password.trim() ||
      !this.fullName.trim()
    ) {
      this.errorMessage = 'Semua field harus diisi!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Password dan konfirmasi password tidak cocok!';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password minimal 6 karakter!';
      return;
    }

    // Simpan ke localStorage
    const user = {
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      phone: this.phone,
    };

    localStorage.setItem('currentUser', this.username);
    localStorage.setItem('userData_' + this.username, JSON.stringify(user));

    this.successMessage = 'Pendaftaran berhasil! Redirect ke login...';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
