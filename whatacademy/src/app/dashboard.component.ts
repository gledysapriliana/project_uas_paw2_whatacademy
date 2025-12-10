import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ParticipantService, Participant } from './participant.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  participants: Participant[] = [];
  currentUser = '';

  constructor(private service: ParticipantService, private router: Router) {
    this.load();
    this.currentUser = localStorage.getItem('currentUser') || '';
  }

  load() {
    this.participants = this.service.getAll();
  }

  remove(id: string) {
    if (!confirm('Hapus peserta ini?')) return;
    this.service.remove(id);
    this.load();
  }

  goAdd() {
    this.router.navigate(['/tambah-peserta']);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
