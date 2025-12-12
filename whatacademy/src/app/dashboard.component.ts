import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParticipantService } from './participant.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(private participantService: ParticipantService) {}

  private readLocalArray(key: string): any[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  getTotalParticipants() {
    // Read from both keys and sync them
    let list = this.readLocalArray('participants');
    if (!list || list.length === 0) {
      list = this.readLocalArray('whatacademy_participants');
    }
    // Keep both keys in sync
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

  getTotalPayments() {
    const list = this.readLocalArray('pembayaran_list');
    return list.length || 0;
  }
}
