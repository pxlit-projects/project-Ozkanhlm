import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostService } from '../../../shared/services/post.service';
import { Post } from '../../../shared/models/post.model';
import { Router } from '@angular/router';
import { RoleService } from '../../../shared/services/role.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css',
})
export class AddPostComponent {
  roleService: RoleService = inject(RoleService);
  role = this.roleService.getRole();

  categories: string[] = [];
  statuses: string[] = [];

  fb: FormBuilder = inject(FormBuilder);

  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  snackBar: MatSnackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.postService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });

    this.postService.getStatuses().subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (error) => {
        console.error('Error fetching statuses:', error);
      },
    });
  }

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    picture: [''],
    content: ['', [Validators.required]],
    author: ['', Validators.required],
    category: ['', Validators.required],
    status: ['', Validators.required],
  });

  onSubmit() {
    const newPost: Post = {
      ...this.postForm.value,
    };

    console.log('Verzonden gegevens:', newPost);

    this.postService.addPost(newPost).subscribe({
      next: () => {
        this.postForm.reset();
        this.snackBar.open('Post succesvol aangemaakt!', 'Sluiten', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });

        this.router.navigate(['/posts']);
      },
      error: (error) => {
        console.error('Error adding post:', error);
      },
    });
  }
}
