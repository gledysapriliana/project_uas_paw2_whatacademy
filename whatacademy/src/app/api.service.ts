import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api';

export interface LoginResponse {
  message: string;
  user: {
    username: string;
    email: string;
    fullName: string;
    role: string;
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
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  register(username: string, email: string, fullName: string, password: string, phone: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${API_URL}/auth/register`, {
      username,
      email,
      fullName,
      password,
      phone
    });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, {
      username,
      password
    });
  }

  getParticipants(): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${API_URL}/participants`);
  }

  addParticipant(name: string, email: string, phone: string): Observable<any> {
    return this.http.post(`${API_URL}/participants`, {
      name,
      email,
      phone
    });
  }

  getParticipant(id: string): Observable<Participant> {
    return this.http.get<Participant>(`${API_URL}/participants/${id}`);
  }

  updateParticipant(id: string, data: any): Observable<any> {
    const updateData = typeof data === 'string' ? { name: data, email: arguments[2], phone: arguments[3] } : data;
    return this.http.put(`${API_URL}/participants/${id}`, updateData);
  }

  deleteParticipant(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/participants/${id}`);
  }
}
