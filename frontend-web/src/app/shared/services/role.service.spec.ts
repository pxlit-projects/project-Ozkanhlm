import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(RoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get role correctly', () => {
    service.setRole('redacteur');
    expect(service.getRole()).toBe('redacteur');
    expect(localStorage.getItem('role')).toBe('redacteur');

    service.setRole(null);
    expect(service.getRole()).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });

  it('should set and get user correctly', () => {
    service.setUser('gebruiker');
    expect(service.getUser()).toBe('gebruiker');
    expect(localStorage.getItem('user')).toBe('gebruiker');

    service.setUser(null);
    expect(service.getUser()).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
