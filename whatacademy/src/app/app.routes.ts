import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { DashboardComponent } from './dashboard.component';
import { TambahPesertaComponent } from './tambah-peserta.component';
import { EditPesertaComponent } from './edit-peserta.component';
import { KelasComponent } from './kelas.component';
import { PembayaranComponent } from './pembayaran.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tambah-peserta', component: TambahPesertaComponent },
  { path: 'edit-peserta/:id', component: EditPesertaComponent },
  { path: 'kelas', component: KelasComponent },
  { path: 'pembayaran', component: PembayaranComponent },
  // fallback to login
  { path: '**', redirectTo: 'login' }
];