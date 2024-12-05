import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../shared/services/post.service';
import { Post } from '../../../shared/models/post.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent {
  categories: string[] = [];
  statuses: string[] = [];

  fb: FormBuilder = inject(FormBuilder);

  postService: PostService = inject(PostService);

  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  id: number = this.route.snapshot.params['id'];

  post$: Observable<Post> = this.postService.getPost(this.id);

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    picture: [''],
    content: ['', [Validators.required]],
    author: ['', Validators.required],
    category: ['', Validators.required],
    status: ['', Validators.required],
  });

  ngOnInit(): void {
    if (isNaN(this.id)) {
      this.router.navigate(['/no-page']);
      return;
    }

    this.post$.subscribe({
      next: (post) => {
        if (post) {
          this.postForm.patchValue(post);
        }
      },
      error: (err) => {
        console.error('Error fetching post:', err);
        this.router.navigate(['/no-page']);
      },
    });

    this.postService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });

    this.postService.getStatuses().subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (err) => {
        console.error('Error fetching statuses:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const updatedPost: Post = this.postForm.value;

      this.postService.updatePost(this.id, updatedPost).subscribe({
        next: () => {
          this.router.navigate(['/posts']);
        },
        error: (error) => {
          console.error('Error updating post:', error);
        },
      });
    } else {
      console.log('Form is not valid');
    }
  }

  deletePost(): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.id).subscribe({
        next: () => {
          this.router.navigate(['/posts']);
        },
        error: (error) => {
          console.error('Error deleting post:', error);
        },
      });
    }
  }
}
