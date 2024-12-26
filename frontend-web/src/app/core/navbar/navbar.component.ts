import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../shared/services/role.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatMenuModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  role: string | null = null;

  router: Router = inject(Router);
  roleService: RoleService = inject(RoleService);

  ngOnInit() {
    this.roleService.role$.subscribe((role) => {
      this.role = role;
    });
  }

  logout(): void {
    this.roleService.setRole(null);
    this.roleService.setUser(null);
    this.router.navigate(['/login']);
  }
}
