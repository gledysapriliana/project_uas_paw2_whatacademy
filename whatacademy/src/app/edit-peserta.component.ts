import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from './participant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-peserta',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-peserta.component.html',
})
export class EditPesertaComponent implements OnInit {
  name = '';
  email = '';
  phone = '';
  classLevel = 'Beginner';
  id = '';
  error = '';
  loading = false;
  initialLoading = true;

  constructor(
    private participantService: ParticipantService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'] || '';
      console.log('Edit ID:', this.id);
      if (this.id) {
        this.loadParticipant();
      } else {
        this.initialLoading = false;
        this.error = 'ID peserta tidak ditemukan!';
      }
    });
  }

  loadParticipant() {
    console.log('Loading participant with ID:', this.id);
    const participant = this.participantService.getById(this.id);
    
    if (participant) {
      console.log('Loaded participant:', participant);
      this.name = participant.name || '';
      this.email = participant.email || '';
      this.phone = participant.phone || '';
      this.classLevel = participant.classLevel || 'Beginner';
      this.error = '';
      this.initialLoading = false;
    } else {
      this.initialLoading = false;
      this.error = 'Peserta dengan ID ' + this.id + ' tidak ditemukan!';
      console.error('Participant not found with ID:', this.id);
    }
  }

  submit() {
    if (!this.name.trim()) {
      this.error = 'Nama tidak boleh kosong';
      return;
    }
    this.error = '';
    this.loading = true;

    const updateData = {
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      classLevel: this.classLevel,
    };

    console.log('Submitting update:', { id: this.id, data: updateData });

    try {
      // Update via ParticipantService (synchronous, updates localStorage directly)
      this.participantService.update(this.id, updateData);
      console.log('Update success via ParticipantService');
      alert('✅ Peserta berhasil diperbarui!');
      // Redirect to peserta list
      this.router.navigate(['/peserta']);
    } catch (err) {
      console.error('Update error:', err);
      this.error = 'Gagal update peserta';
      this.loading = false;
      alert('❌ Gagal update peserta');
    }
  }

  cancel() {
    this.router.navigate(['/peserta']);
  }
}
