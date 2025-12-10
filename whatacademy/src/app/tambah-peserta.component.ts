import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ParticipantService } from './participant.service';

@Component({
  selector: 'app-tambah-peserta',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tambah-peserta.component.html',
  styleUrls: ['./tambah-peserta.component.css']
})
export class TambahPesertaComponent {
  name = '';
  email = '';
  phone = '';

  constructor(private service: ParticipantService, private router: Router) {}

  submit() {
    if (!this.name.trim()) return;
    this.service.add({ name: this.name.trim(), email: this.email.trim(), phone: this.phone.trim() });
    this.router.navigate(['/dashboard']);
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
