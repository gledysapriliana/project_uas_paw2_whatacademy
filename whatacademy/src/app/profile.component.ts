import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  constructor(private router: Router) {}

  get user() {
    const raw = localStorage.getItem('currentUserData');
    return raw ? JSON.parse(raw) : null;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserData');
    this.router.navigate(['/login']);
  }
}
