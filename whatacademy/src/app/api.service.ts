import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

const API_URL = 'http://localhost:3000/api';

export interface LoginResponse {
  message: string;
  user: {
    username: string;
    email: string;
    fullName: string;
    role: string;
    phone?: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    username: string;
    email: string;
    fullName: string;
  };
}

export interface Participant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  classLevel?: string;
}

interface StoredUser {
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  password: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private usersKey = 'whatacademy_users';
  private participantsKey = 'whatacademy_participants';

  constructor(private http: HttpClient) {}

  /* ---------------------------
     Helpers: localStorage users
     --------------------------- */
  private loadUsers(): Record<string, StoredUser> {
    try {
      const raw = localStorage.getItem(this.usersKey);
      const users = raw ? JSON.parse(raw) : {};
      // Seed default users when none exist to allow login in dev/demo
      if (!raw || Object.keys(users).length === 0) {
        const defaultUsers: Record<string, StoredUser> = {
          testuser: {
            username: 'testuser',
            email: 'test@example.com',
            fullName: 'Test User',
            phone: '08123456789',
            password: 'test123',
            role: 'user',
          },
          admin: {
            username: 'admin',
            email: 'admin@example.com',
            fullName: 'Admin User',
            phone: '08987654321',
            password: 'admin123',
            role: 'admin',
          },
        };
        this.saveUsers(defaultUsers);
        return defaultUsers;
      }
      return users;
    } catch {
      return {};
    }
  }

  private saveUsers(users: Record<string, StoredUser>) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  /* ---------------------------
     Helpers: localStorage participants
     --------------------------- */
  private loadParticipantsLocal(): Participant[] {
    try {
      const raw = localStorage.getItem(this.participantsKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveParticipantsLocal(items: Participant[]) {
    localStorage.setItem(this.participantsKey, JSON.stringify(items));
  }

  /* ---------------------------
     Register
     --------------------------- */
  register(
    username: string,
    email: string,
    fullName: string,
    password: string,
    phone: string
  ): Observable<RegisterResponse> {
    // Try API call first; if it fails use local fallback
    return this.http
      .post<RegisterResponse>(`${API_URL}/auth/register`, {
        username,
        email,
        fullName,
        password,
        phone,
      })
      .pipe(
        catchError(() => {
          // fallback: localStorage
          const users = this.loadUsers();
          if (users[username]) {
            return throwError(() => ({ error: { error: 'Username sudah terdaftar' } }));
          }
          users[username] = { username, email, fullName, phone, password, role: 'user' };
          this.saveUsers(users);

          const response: RegisterResponse = {
            message: 'registered (local)',
            user: { username, email, fullName },
          };
          // simulate network latency a little
          return of(response).pipe(delay(300));
        })
      );
  }

  /* ---------------------------
     Login
     --------------------------- */
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { username, password }).pipe(
      catchError(() => {
        // fallback: validate against localStorage users
        const users = this.loadUsers();

        const u = users[username];
        if (!u || u.password !== password) {
          return throwError(() => ({ error: { error: 'Username atau password salah (local)' } }));
        }

        const response: LoginResponse = {
          message: 'logged-in (local)',
          user: {
            username: u.username,
            email: u.email,
            fullName: u.fullName,
            role: u.role || 'user',
            phone: u.phone,
          },
        };
        return of(response).pipe(delay(200));
      })
    );
  }

  /* ---------------------------
     Participants (list/add/get/update/delete)
     These try API then fallback to localStorage
     --------------------------- */
  getParticipants(): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${API_URL}/participants`).pipe(
      catchError(() => {
        const items = this.loadParticipantsLocal();
        return of(items).pipe(delay(150));
      })
    );
  }

  addParticipant(name: string, email: string, phone: string): Observable<any> {
    return this.http.post(`${API_URL}/participants`, { name, email, phone }).pipe(
      catchError(() => {
        const items = this.loadParticipantsLocal();
        const id = Date.now().toString();
        const p: Participant = { id, name, email, phone };
        items.push(p);
        this.saveParticipantsLocal(items);
        return of({ message: 'created (local)', participant: p }).pipe(delay(150));
      })
    );
  }

  getParticipant(id: string): Observable<Participant> {
    return this.http.get<Participant>(`${API_URL}/participants/${id}`).pipe(
      catchError(() => {
        const items = this.loadParticipantsLocal();
        const p = items.find((x) => x.id === id);
        if (!p) {
          return throwError(() => ({ error: { error: 'Peserta tidak ditemukan (local)' } }));
        }
        return of(p).pipe(delay(100));
      })
    );
  }

  updateParticipant(id: string, data: any): Observable<any> {
    return this.http.put(`${API_URL}/participants/${id}`, data).pipe(
      catchError(() => {
        const items = this.loadParticipantsLocal();
        const idx = items.findIndex((x) => x.id === id);
        if (idx === -1) {
          return throwError(() => ({ error: { error: 'Peserta tidak ditemukan (local)' } }));
        }
        items[idx] = { ...items[idx], ...data };
        this.saveParticipantsLocal(items);
        return of({ message: 'updated (local)', participant: items[idx] }).pipe(delay(100));
      })
    );
  }

  deleteParticipant(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/participants/${id}`).pipe(
      catchError(() => {
        let items = this.loadParticipantsLocal();
        items = items.filter((x) => x.id !== id);
        this.saveParticipantsLocal(items);
        return of({ message: 'deleted (local)' }).pipe(delay(100));
      })
    );
  }
}
