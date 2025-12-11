import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-peserta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-peserta.component.html',
  styleUrls: ['./edit-peserta.component.css']
})
export class EditPesertaComponent implements OnInit {
  name = '';
  email = '';
  phone = '';
  id = '';
  error = '';
  loading = false;
  initialLoading = true;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') || '';
      if (this.id) {
        this.loadParticipant();
      } else {
        this.initialLoading = false;
      }
    });
  }

  loadParticipant() {
    this.apiService.getParticipant(this.id).subscribe({
      next: (participant: any) => {
        this.name = participant.name;
        this.email = participant.email || '';
        this.phone = participant.phone || '';
        this.initialLoading = false;
      },
      error: (err) => {
        this.error = 'Gagal memuat data peserta';
        this.initialLoading = false;
      }
    });
  }

  submit() {
    if (!this.name.trim()) {
      this.error = 'Nama tidak boleh kosong';
      return;
    }
    this.error = '';
    this.loading = true;
    this.apiService.updateParticipant(this.id, {
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim()
    }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Gagal mengupdate peserta';
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
