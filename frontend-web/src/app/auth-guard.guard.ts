import { inject, Injectable } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  console.log('authGuardGuard route', route, 'authGuardGuard route', state);

  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (role) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
