import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { ParticipantService } from './participant.service';

@Component({
  selector: 'app-tambah-peserta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tambah-peserta.component.html'
})
export class TambahPesertaComponent {
  name = '';
  email = '';
  phone = '';
  error = '';
  loading = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private participantService: ParticipantService
  ) {}

  submit() {
    this.error = '';
    this.loading = true;

    if (!this.name.trim()) {
      this.error = 'Nama tidak boleh kosong';
      this.loading = false;
      return;
    }

    this.apiService
      .addParticipant(this.name.trim(), this.email.trim(), this.phone.trim())
      .subscribe({
        next: (res) => {
          // res.participant may exist for local fallback
          try {
            const p =
              res && res.participant
                ? res.participant
                : {
                    id: Date.now().toString(),
                    name: this.name.trim(),
                    email: this.email.trim(),
                    phone: this.phone.trim(),
                  };
            // ensure participant service also has the item for components reading 'participants' key
            this.participantService.add({ name: p.name, email: p.email, phone: p.phone });
          } catch {}

          alert('✅ Peserta berhasil ditambahkan!');
          this.router.navigate(['/dashboard']);
          this.loading = false;
        },
        error: (err) => {
          alert('❌ ' + (err.error?.error || 'Gagal menambah peserta'));
          this.error = err.error?.error || 'Gagal menambah peserta';
          this.loading = false;
        },
      });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
