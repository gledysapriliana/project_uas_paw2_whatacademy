import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { DashboardComponent } from './dashboard.component';
import { TambahPesertaComponent } from './tambah-peserta.component';
import { ParticipantListComponent } from './participant-list.component';
import { EditPesertaComponent } from './edit-peserta.component';
import { KelasComponent } from './kelas.component';
import { PembayaranComponent } from './pembayaran.component';
import { ProfileComponent } from './profile.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'peserta', component: ParticipantListComponent, canActivate: [AuthGuard] },
  { path: 'tambah-peserta', component: TambahPesertaComponent, canActivate: [AuthGuard] },
  { path: 'edit-participant/:id', component: EditPesertaComponent, canActivate: [AuthGuard] },
  { path: 'kelas', component: KelasComponent, canActivate: [AuthGuard] },
  { path: 'pembayaran', component: PembayaranComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'login' },
];
