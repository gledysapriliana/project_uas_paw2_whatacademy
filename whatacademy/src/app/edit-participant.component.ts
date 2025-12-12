import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService, Participant } from './participant.service';
import { ApiService } from './api.service';

@Component({
  selector: 'app-edit-participant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-participant.component.html'
})
export class EditParticipantComponent implements OnInit {
  id = '';
  participant: Participant | undefined;
  name = '';
  email = '';
  phone = '';
  error = '';
  success = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private participantService: ParticipantService,
    private api: ApiService
  ) {
    this.id = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.participant = this.participantService.getById(this.id);
    if (this.participant) {
      this.name = this.participant.name;
      this.email = this.participant.email || '';
      this.phone = this.participant.phone || '';
    } else {
      // try api fallback
      this.api.getParticipant(this.id).subscribe({
        next: (p) => {
          this.name = p.name;
          this.email = p.email || '';
          this.phone = p.phone || '';
        },
        error: () => {
          this.error = 'Peserta tidak ditemukan';
        },
      });
    }
  }

  save() {
    if (!this.name.trim()) {
      this.error = 'Nama tidak boleh kosong';
      return;
    }
    this.loading = true;
    // prefer ApiService update, fallback to ParticipantService
    this.api
      .updateParticipant(this.id, {
        name: this.name.trim(),
        email: this.email.trim(),
        phone: this.phone.trim(),
      })
      .subscribe({
        next: () => {
          // also sync to local participant service
          this.participantService.update(this.id, {
            name: this.name.trim(),
            email: this.email.trim(),
            phone: this.phone.trim(),
          });
          this.success = 'Perubahan tersimpan';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/peserta']), 800);
        },
        error: () => {
          // fallback
          this.participantService.update(this.id, {
            name: this.name.trim(),
            email: this.email.trim(),
            phone: this.phone.trim(),
          });
          this.success = 'Perubahan tersimpan (local)';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/peserta']), 800);
        },
      });
  }

  cancel() {
    this.router.navigate(['/peserta']);
  }
}
