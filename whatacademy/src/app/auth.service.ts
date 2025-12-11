import { Injectable } from '@angular/core';

export interface User {
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserKey = 'currentUser';

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(this.currentUserKey);
    return raw ? JSON.parse(raw) : null;
  }

  setCurrentUser(user: User) {
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  getCurrentUsername(): string {
    const user = this.getCurrentUser();
    return user?.username || '';
  }

  logout() {
    localStorage.removeItem(this.currentUserKey);
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin' || false;
  }
}
