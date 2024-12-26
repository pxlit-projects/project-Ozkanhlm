import { ComentsComponent } from './../coments/coments.component';
import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../shared/services/post.service';
import { Post } from '../../../shared/models/post.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RoleService } from '../../../shared/services/role.service';
import { NoPageComponent } from '../../no-page/no-page.component';
import { ReviewsComponent } from '../reviews/reviews.component';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    DatePipe,
    NoPageComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReviewsComponent,
    ComentsComponent,
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css',
})
export class PostDetailComponent {
  roleService: RoleService = inject(RoleService);
  role = this.roleService.getRole();
  user = this.roleService.getUser();

  categories: string[] = [];
  statuses: string[] = [];

  fb: FormBuilder = inject(FormBuilder);
  postService: PostService = inject(PostService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  snackBar: MatSnackBar = inject(MatSnackBar);

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
      next: () => {
        this.snackBar.open('Post succesvol Bijgewerkt!', 'Sluiten', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
        this.router.navigate(['/posts']);
      },
      error: (err) => console.error('Error updating post:', err),
    });
  }

  deletePost(): void {
    if (confirm('Are you sure you want to delete this Post?')) {
      this.postService.deletePost(this.id).subscribe({
        next: () => this.router.navigate(['/posts']),
        error: (err) => console.error('Error deleting post:', err),
      });
    }
  }
}
