import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Pembayaran {
  id: string;
  peserta: string;
  jumlah: number;
  metode: string;
  status: string;
  tanggal: string;
  classLevel?: string;
}

@Component({
  selector: 'app-pembayaran',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pembayaran.component.html',
})
export class PembayaranComponent implements OnInit {
  pembayaranList: Pembayaran[] = [];
  showModal = false;
  peserta = '';
  jumlah = '';
  metode = 'Transfer Bank';
  status = 'Lunas';
  error = '';
  pesertaList: any[] = [];

  editingId: string | null = null;

  ngOnInit() {
    this.loadData();
    this.loadPesertaList();
  }

  loadPesertaList() {
    const stored = localStorage.getItem('whatacademy_participants');
    if (stored) {
      try {
        this.pesertaList = JSON.parse(stored);
        console.log('Peserta List loaded:', this.pesertaList);
      } catch (e) {
        console.error('Error parsing peserta list:', e);
        this.pesertaList = [];
      }
    } else {
      this.pesertaList = [];
    }
  }

  loadData() {
    const stored = localStorage.getItem('pembayaran_list');
    this.pembayaranList = stored ? JSON.parse(stored) : this.getDefaultPayments();
  }

  getDefaultPayments(): Pembayaran[] {
    return [
      {
        id: '1',
        peserta: 'Ahmad Rizki (ahmad@email.com)',
        jumlah: 1500000,
        metode: 'Transfer Bank',
        status: 'Lunas',
        tanggal: '2024-01-15',
      },
      {
        id: '2',
        peserta: 'Siti Nurhaliza (siti@email.com)',
        jumlah: 2000000,
        metode: 'E-Wallet',
        status: 'Lunas',
        tanggal: '2024-01-20',
      },
      {
        id: '3',
        peserta: 'Budi Santoso (budi@email.com)',
        jumlah: 1250000,
        metode: 'Cash',
        status: 'Belum Lunas',
        tanggal: '2024-02-01',
      },
    ];
  }

  openModal(edit?: Pembayaran) {
    this.loadPesertaList(); // Refresh peserta list setiap kali modal dibuka
    this.showModal = true;
    if (edit) {
      this.editingId = edit.id;
      this.peserta = edit.peserta;
      this.jumlah = String(edit.jumlah);
      this.metode = edit.metode;
      this.status = edit.status;
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
    this.peserta = '';
    this.jumlah = '';
    this.metode = 'Transfer Bank';
    this.status = 'Lunas';
    this.error = '';
  }

  submit() {
    // Reset error
    this.error = '';

    // Validasi peserta
    if (!this.peserta || !this.peserta.trim()) {
      this.error = 'Peserta tidak boleh kosong';
      return;
    }

    // Validasi jumlah
    if (!this.jumlah || !this.jumlah.toString().trim()) {
      this.error = 'Jumlah tidak boleh kosong';
      return;
    }

    const jumlahNum = parseInt(this.jumlah.toString());
    if (isNaN(jumlahNum) || jumlahNum <= 0) {
      this.error = 'Jumlah harus angka positif';
      return;
    }

    // Validasi metode
    if (!this.metode || !this.metode.trim()) {
      this.error = 'Metode pembayaran tidak boleh kosong';
      return;
    }

    // Validasi status
    if (!this.status || !this.status.trim()) {
      this.error = 'Status tidak boleh kosong';
      return;
    }

    const stored = localStorage.getItem('pembayaran_list');
    const list: Pembayaran[] = stored ? JSON.parse(stored) : this.getDefaultPayments();

    let classLevel = '';
    let pesertaName = '';
    
    // Parse peserta string
    const pesertaParts = this.peserta.split('|');
    if (pesertaParts.length > 1) {
      classLevel = pesertaParts[1].trim();
      pesertaName = pesertaParts[0].trim();
    } else {
      pesertaName = this.peserta.trim();
    }

    if (this.editingId) {
      // Mode edit
      const idx = list.findIndex((p) => p.id === this.editingId);
      if (idx !== -1) {
        list[idx] = {
          id: this.editingId,
          peserta: pesertaName,
          jumlah: jumlahNum,
          metode: this.metode.trim(),
          status: this.status.trim(),
          tanggal: new Date().toISOString().split('T')[0],
          classLevel: classLevel,
        };
        localStorage.setItem('pembayaran_list', JSON.stringify(list));
        alert('✅ Pembayaran berhasil diperbarui!');
        this.loadData();
        this.closeModal();
        return;
      }
      this.error = 'Pembayaran tidak ditemukan';
      return;
    }

    // Mode tambah baru
    const newPembayaran: Pembayaran = {
      id: Date.now().toString(),
      peserta: pesertaName,
      jumlah: jumlahNum,
      metode: this.metode.trim(),
      status: this.status.trim(),
      tanggal: new Date().toISOString().split('T')[0],
      classLevel: classLevel,
    };
    
    list.push(newPembayaran);
    localStorage.setItem('pembayaran_list', JSON.stringify(list));

    alert('✅ Pembayaran berhasil dicatat!');
    this.loadData();
    this.closeModal();
  }

  isFormValid(): boolean {
    return !!(
      this.peserta && 
      this.peserta.trim() && 
      this.jumlah && 
      parseInt(this.jumlah.toString()) > 0 && 
      this.metode && 
      this.metode.trim() && 
      this.status && 
      this.status.trim()
    );
  }

  deletePembayaran(id: string) {
    if (!confirm('Hapus pembayaran ini?')) return;
    this.pembayaranList = this.pembayaranList.filter((p) => p.id !== id);
    localStorage.setItem('pembayaran_list', JSON.stringify(this.pembayaranList));
    alert('✅ Pembayaran berhasil dihapus!');
  }

  getTotalPeserta() {
    return this.pembayaranList.length;
  }
  getLunasCount() {
    return this.pembayaranList.filter((p) => p.status === 'Lunas').length;
  }
  getBelumLunasCount() {
    return this.pembayaranList.filter((p) => p.status === 'Belum Lunas').length;
  }

  getPesertaByClass(classLevel: string) {
    return this.pesertaList.filter((p) => p.classLevel === classLevel);
  }

  formatRupiah(amount: number) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
