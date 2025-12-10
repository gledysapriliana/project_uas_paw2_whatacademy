import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    // Simple login: accept any non-empty username
    if (!this.username.trim()) return;
    localStorage.setItem('currentUser', this.username.trim());
    this.router.navigate(['/dashboard']);
  }
}
