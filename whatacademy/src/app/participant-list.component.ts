import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ParticipantService, Participant } from './participant.service';

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './participant-list.component.html',
})
export class ParticipantListComponent implements OnInit {
  participants: Participant[] = [];
  filteredParticipants: Participant[] = [];
  searchTerm = '';

  constructor(private participantService: ParticipantService, private router: Router) {}

  ngOnInit(): void {
    this.loadParticipants();
  }

  loadParticipants(): void {
    this.participants = this.participantService.getAll();
    this.applyFilter();
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredParticipants = this.participants.filter((p) => {
      if (!term) return true;
      return (
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.email && p.email.toLowerCase().includes(term)) ||
        (p.phone && p.phone.toLowerCase().includes(term))
      );
    });
  }

  deleteParticipant(id: string) {
    if (!confirm('Hapus peserta ini?')) return;
    this.participantService.remove(id);
    this.loadParticipants();
  }

  editParticipant(id: string) {
    this.router.navigate(['/edit-participant', id]);
  }
}
