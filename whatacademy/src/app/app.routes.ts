import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { DashboardComponent } from './dashboard.component';
import { TambahPesertaComponent } from './tambah-peserta.component';
import { EditPesertaComponent } from './edit-peserta.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tambah-peserta', component: TambahPesertaComponent },
  { path: 'edit-peserta/:id', component: EditPesertaComponent },
  // fallback to login
  { path: '**', redirectTo: 'login' }
];