import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { DashboardComponent } from './dashboard.component';
import { TambahPesertaComponent } from './tambah-peserta.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'dashboard', component: DashboardComponent },
	{ path: 'tambah-peserta', component: TambahPesertaComponent },
	// fallback to login
	{ path: '**', redirectTo: 'login' }
];
