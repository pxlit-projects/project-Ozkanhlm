import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuardGuard } from './auth-guard.guard';
import { RoleService } from './shared/services/role.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('authGuardGuard', () => {
  let mockRoleService: jasmine.SpyObj<RoleService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuardGuard(...guardParameters));

  beforeEach(() => {
    mockRoleService = jasmine.createSpyObj('RoleService', ['getRole']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: RoleService, useValue: mockRoleService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow activation when user has a role', () => {
    mockRoleService.getRole.and.returnValue('redacteur');
    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should prevent activation and redirect to login when user has no role', () => {
    mockRoleService.getRole.and.returnValue(null);
    const result = executeGuard({} as any, {} as any);
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
