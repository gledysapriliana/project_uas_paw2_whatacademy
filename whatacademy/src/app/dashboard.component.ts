import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParticipantService } from './participant.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
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
    const list =
      this.readLocalArray('participants') || this.readLocalArray('whatacademy_participants');
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
