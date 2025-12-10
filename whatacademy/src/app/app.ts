import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LoginComponent } from './login.component';
import { DashboardComponent } from './dashboard.component';
import { TambahPesertaComponent } from './tambah-peserta.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, DashboardComponent, TambahPesertaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('whatacademy');
}
