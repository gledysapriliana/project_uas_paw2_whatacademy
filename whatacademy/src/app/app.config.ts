import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withFetch()),
  ],
};

// Initialize test user on app startup
export function initializeApp() {
  return () => {
    const stored = localStorage.getItem('whatacademy_users');
    if (!stored) {
      // Create default test user
      const testUsers = {
        testuser: {
          username: 'testuser',
          email: 'test@example.com',
          fullName: 'Test User',
          phone: '08123456789',
          password: 'test123',
          role: 'user',
        },
        admin: {
          username: 'admin',
          email: 'admin@example.com',
          fullName: 'Admin User',
          phone: '08987654321',
          password: 'admin123',
          role: 'admin',
        },
      };
      localStorage.setItem('whatacademy_users', JSON.stringify(testUsers));
    }
  };
}
