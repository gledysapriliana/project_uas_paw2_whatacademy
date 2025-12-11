import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  login() {
    this.error = '';
    this.loading = true;

    if (!this.username.trim()) {
      this.error = 'Username tidak boleh kosong';
      this.loading = false;
      return;
    }

    if (!this.password.trim()) {
      this.error = 'Password tidak boleh kosong';
      this.loading = false;
      return;
    }

    this.apiService.login(this.username.trim(), this.password.trim()).subscribe({
      next: (response) => {
        this.authService.setCurrentUser(response.user);
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Login gagal!';
        this.loading = false;
      }
    });
  }
}
