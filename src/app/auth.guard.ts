import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth-service.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user.pipe(
    map((user) => {
      if (user && user.token) {
        // User is authenticated, proceed
        return true;
      } else {
        // User not authenticated, redirect to login page
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
