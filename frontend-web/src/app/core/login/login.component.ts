import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RoleService } from '../../shared/services/role.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  backgroundImage = 'bg-java.jpg';
  router: Router = inject(Router);
  roleService: RoleService = inject(RoleService);
  fb: FormBuilder = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    const { username, password } = this.loginForm.value;
    const user = environment.users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      this.roleService.setRole(user.role);
      this.roleService.setUser(user.username);
      this.router.navigate(['/posts']);
    } else {
      console.error('Invalid username or password');
    }
  }
}
