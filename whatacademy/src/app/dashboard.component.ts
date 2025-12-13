import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParticipantService } from './participant.service';

interface Participant {
  id: string;
  name: string;
  email: string;
  level?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  recentParticipants: Participant[] = [];

  constructor(private participantService: ParticipantService) {}

  ngOnInit() {
    this.loadRecentParticipants();
  }

  private readLocalArray(key: string): any[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  getTotalParticipants() {
    let list = this.readLocalArray('participants');
    if (!list || list.length === 0) {
      list = this.readLocalArray('whatacademy_participants');
    }
    if (list && list.length > 0) {
      localStorage.setItem('participants', JSON.stringify(list));
      localStorage.setItem('whatacademy_participants', JSON.stringify(list));
    }
    return list.length || 0;
  }

  getTotalClasses() {
    const list = this.readLocalArray('kelas_list');
    return list.length || 0;
  }

  getPaymentsLunas() {
    const list = this.readLocalArray('pembayaran_list');
    return list.filter((p: any) => p.status === 'Lunas').length || 0;
  }

  getPaymentsBelumLunas() {
    const list = this.readLocalArray('pembayaran_list');
    return list.filter((p: any) => p.status === 'Belum Lunas').length || 0;
  }

  getTotalPayments() {
    const list = this.readLocalArray('pembayaran_list');
    return list.length || 0;
  }

  getParticipantsByLevel(level: string) {
    const list = this.readLocalArray('participants');
    return list.filter((p: any) => p.level === level).length || 0;
  }

  loadRecentParticipants() {
    let list = this.readLocalArray('participants');
    if (!list || list.length === 0) {
      list = this.readLocalArray('whatacademy_participants');
    }
    // Sort by createdAt (newest first) and take last 4
    this.recentParticipants = list
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 4);
  }

  getTotalParticipantsForStats() {
    return this.getTotalParticipants();
  }
}
