import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RoleService } from '../../shared/services/role.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  backgroundImage = 'bg-java.jpg';
  router: Router = inject(Router);
  roleService: RoleService = inject(RoleService);
  snackBar: MatSnackBar = inject(MatSnackBar);

  username: string = '';
  password: string = '';

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      this.snackBar.open('Vul alle velden correct in', 'Sluiten', {
        duration: 3000,
        panelClass: ['error-toast'],
      });
    }

    const user = environment.users.find(
      (u) => u.username === this.username && u.password === this.password
    );

    if (user) {
      this.roleService.setRole(user.role);
      this.roleService.setUser(user.username);
      this.router.navigate(['/posts']);
    } else {
      this.snackBar.open('Onjuiste gebruikersnaam of wachtwoord', 'Sluiten', {
        duration: 3000,
        panelClass: ['error-toast'],
      });
    }
  }
}
