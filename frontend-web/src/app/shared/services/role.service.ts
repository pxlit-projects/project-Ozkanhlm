import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private roleSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('role')
  );
  role$ = this.roleSubject.asObservable();

  private userSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('user')
  );
  user$ = this.userSubject.asObservable();

  setRole(role: string | null): void {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
    this.roleSubject.next(role);
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }

  setUser(user: string | null): void {
    if (user) {
      localStorage.setItem('user', user);
    } else {
      localStorage.removeItem('user');
    }
    this.userSubject.next(user);
  }

  getUser(): string | null {
    return this.userSubject.value;
  }
}
