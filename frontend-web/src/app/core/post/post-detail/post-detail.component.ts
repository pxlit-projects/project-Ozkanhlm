import { ReviewService } from './../../../shared/services/review.service';
import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
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
import { RoleService } from '../../../shared/services/role.service';
import { Review } from '../../../shared/models/review.model';
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, DatePipe],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent {
  isRejected: boolean = false;
  roleService: RoleService = inject(RoleService);
  role = this.roleService.getRole();

  categories: string[] = [];
  statuses: string[] = [];

  fb: FormBuilder = inject(FormBuilder);
  postService: PostService = inject(PostService);
  reviewService: ReviewService = inject(ReviewService);
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

  reviewForm: FormGroup = this.fb.group({
    reviewStatus: ['', Validators.required],
    reviewMessage: [''],
  });

  ngOnInit(): void {
    if (isNaN(this.id)) {
      this.router.navigate(['/no-page']);
      return;
    }

    this.loadPostDetails();
    this.loadCategoriesAndStatuses();
  }

  private loadPostDetails(): void {
    this.post$.subscribe({
      next: (post) => {
        if (post) {
          this.postForm.patchValue(post);

          if (post.reviews && post.reviews.length > 0) {
            const lastReview = post.reviews[post.reviews.length - 1];
            if (lastReview.reviewStatus === 'REJECTED') {
              this.statuses = this.statuses.filter(
                (status: string) => status !== 'PUBLISH'
              );
            }
          }
        }
      },
      error: () => this.router.navigate(['/no-page']),
    });
  }

  private loadCategoriesAndStatuses(): void {
    this.postService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error fetching categories:', err),
    });

    this.postService.getStatuses().subscribe({
      next: (data) => (this.statuses = data),
      error: (err) => console.error('Error fetching statuses:', err),
    });
  }

  onSubmit(): void {
    if (!this.postForm.valid) {
      console.warn('Form is not valid');
    }

    const updatedPost: Post = this.postForm.value;

    this.postService.updatePost(this.id, updatedPost).subscribe({
      next: () => this.router.navigate(['/posts']),
      error: (err) => console.error('Error updating post:', err),
    });
  }

  deletePost(): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.id).subscribe({
        next: () => this.router.navigate(['/posts']),
        error: (err) => console.error('Error deleting post:', err),
      });
    }
  }

  onSubmitReview(): void {
    if (!this.reviewForm.valid) {
      console.warn('Review form is not valid');
      return;
    }

    const reviewData: Review = this.reviewForm.value;
    reviewData.postId = this.id;

    this.reviewService.addReview(reviewData).subscribe({
      next: () => this.router.navigate(['/workbanch']),
      error: (err) => console.error('Error adding review:', err),
    });
  }

  onStatusChange(status: string): void {
    if (status === 'REJECTED') {
      this.isRejected = true;
    } else {
      this.isRejected = false;
    }
  }
}
