import { inject, Injectable } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { RoleService } from './shared/services/role.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const roleService: RoleService = inject(RoleService);
  const role = roleService.getRole();

  if (role) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
