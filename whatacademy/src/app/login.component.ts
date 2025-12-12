import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  public submit(): void {
    this.error = '';
    if (!this.username.trim() || !this.password) {
      this.error = 'Username dan password harus diisi';
      return;
    }
    this.loading = true;
    this.api.login(this.username.trim(), this.password).subscribe({
      next: (res) => {
        // Store user session
        localStorage.setItem('currentUser', res.user.username);
        localStorage.setItem('currentUserData', JSON.stringify(res.user));
        this.loading = false;
        // Navigate via router without reloading the page
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Login gagal';
      },
    });
  }
}
