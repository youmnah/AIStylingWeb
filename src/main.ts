import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { AuthService } from './app/auth.service';
import { environment } from './environments/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (environment.production) {
  enableProdMode();
}

export function initApp(authService: AuthService) {
  return () => authService.initializeLogin();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));