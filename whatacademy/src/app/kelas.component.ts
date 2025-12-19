import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Kelas {
  id: string;
  namaKelas: string;
  level: string;
  jadwal: string;
  instruktur: string;
  kapasitas: number;
}

@Component({
  selector: 'app-kelas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kelas.component.html',
})
export class KelasComponent implements OnInit {
  kelasGroups: { level: string; kelas: Kelas[] }[] = [];
  showModal = false;
  namaKelas = '';
  level = 'Beginner';
  jadwal = '';
  instruktur = '';
  kapasitas = '';
  error = '';

  editingId: string | null = null;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const stored = localStorage.getItem('kelas_list');
    const kelasList: Kelas[] = stored ? JSON.parse(stored) : this.getDefaultClasses();
    this.groupByLevel(kelasList);
  }

  getDefaultClasses(): Kelas[] {
    return [
      {
        id: '1',
        namaKelas: 'English Basics A',
        level: 'Beginner',
        jadwal: 'Senin & Rabu, 09:00 - 11:00',
        instruktur: 'Mr. John Smith',
        kapasitas: 15,
      },
      {
        id: '2',
        namaKelas: 'English Basics B',
        level: 'Beginner',
        jadwal: 'Selasa & Kamis, 09:00 - 11:00',
        instruktur: 'Ms. Emily White',
        kapasitas: 15,
      },
      {
        id: '3',
        namaKelas: 'Intermediate English B',
        level: 'Intermediate',
        jadwal: 'Selasa & Kamis, 13:00 - 15:00',
        instruktur: 'Ms. Sarah Johnson',
        kapasitas: 12,
      },
    ];
  }

  groupByLevel(kelasList: Kelas[]) {
    const grouped: { [key: string]: Kelas[] } = {};
    kelasList.forEach((k) => {
      if (!grouped[k.level]) grouped[k.level] = [];
      grouped[k.level].push(k);
    });
    this.kelasGroups = Object.keys(grouped).map((level) => ({ level, kelas: grouped[level] }));
  }

  openModal(edit?: Kelas) {
    this.showModal = true;
    if (edit) {
      this.editingId = edit.id;
      this.namaKelas = edit.namaKelas;
      this.level = edit.level;
      this.jadwal = edit.jadwal;
      this.instruktur = edit.instruktur;
      this.kapasitas = String(edit.kapasitas);
      this.error = '';
    } else {
      this.editingId = null;
      this.resetForm();
    }
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
    this.editingId = null;
  }

  resetForm() {
    this.namaKelas = '';
    this.level = 'Beginner';
    this.jadwal = '';
    this.instruktur = '';
    this.kapasitas = '';
    this.error = '';
  }

  submit() {
    if (!this.namaKelas.trim()) {
      this.error = 'Nama Kelas tidak boleh kosong';
      return;
    }
    if (!this.jadwal.trim() || !this.instruktur.trim() || !this.kapasitas) {
      this.error = 'Semua field harus diisi';
      return;
    }

    const stored = localStorage.getItem('kelas_list');
    const kelasList: Kelas[] = stored ? JSON.parse(stored) : this.getDefaultClasses();

    if (this.editingId) {
      const idx = kelasList.findIndex((k) => k.id === this.editingId);
      if (idx !== -1) {
        kelasList[idx] = {
          id: this.editingId,
          namaKelas: this.namaKelas.trim(),
          level: this.level,
          jadwal: this.jadwal.trim(),
          instruktur: this.instruktur.trim(),
          kapasitas: parseInt(this.kapasitas),
        };
        localStorage.setItem('kelas_list', JSON.stringify(kelasList));
        alert('✅ Kelas berhasil diperbarui!');
        this.loadData();
        this.closeModal();
        return;
      }
      this.error = 'Kelas yang akan diedit tidak ditemukan';
      return;
    }

    const newKelas: Kelas = {
      id: Date.now().toString(),
      namaKelas: this.namaKelas.trim(),
      level: this.level,
      jadwal: this.jadwal.trim(),
      instruktur: this.instruktur.trim(),
      kapasitas: parseInt(this.kapasitas),
    };
    kelasList.push(newKelas);
    localStorage.setItem('kelas_list', JSON.stringify(kelasList));

    alert('✅ Kelas berhasil ditambahkan!');
    this.loadData();
    this.closeModal();
  }

  deleteKelas(id: string) {
    if (!confirm('Hapus kelas ini?')) return;
    const stored = localStorage.getItem('kelas_list');
    const kelasList: Kelas[] = stored ? JSON.parse(stored) : [];
    const filtered = kelasList.filter((k) => k.id !== id);
    localStorage.setItem('kelas_list', JSON.stringify(filtered));
    alert('✅ Kelas berhasil dihapus!');
    this.loadData();
  }

  getMembersOfClass(level: string): any[] {
    const participants = JSON.parse(localStorage.getItem('whatacademy_participants') || '[]');
    return participants.filter((p: any) => p.classLevel === level);
  }
}
