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

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [ReactiveFormsModule],
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

  ngOnInit(): void {
    this.postService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;

        console.log(this.categories);
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
    picture: ['', [Validators.required]],
    content: ['', [Validators.required]],
    author: ['', Validators.required],
    category: ['', Validators.required],
    status: ['', Validators.required],
  });

  onSubmit() {
    const newPost: Post = {
      ...this.postForm.value,
    };

    this.postService.addPost(newPost).subscribe({
      next: () => {
        this.postForm.reset();
        this.router.navigate(['/posts']);
      },
      error: (error) => {
        console.error('Error adding post:', error);
      },
    });
  }
}
