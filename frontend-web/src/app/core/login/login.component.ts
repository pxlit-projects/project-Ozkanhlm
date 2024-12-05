import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  router: Router = inject(Router);

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
      localStorage.setItem('role', user.role);
      this.router.navigate(['/posts']);
    } else {
      console.error('Invalid username or password');
    }
  }
}
