import { Component, OnDestroy, inject } from '@angular/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Observable, Subscription, tap } from 'rxjs';
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
  imports: [NgIf, NgClass, AsyncPipe, ReactiveFormsModule],
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
    picture: ['', [Validators.required]],
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

    this.post$.subscribe((post) => {
      if (post) {
        this.postForm.patchValue(post);
      }
    });

    this.postService.getCategories().subscribe((data) => {
      this.categories = data;
    });

    this.postService.getStatuses().subscribe((data) => {
      this.statuses = data;
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const updatedPost: Post = this.postForm.value;
      console.log('Updating post...', updatedPost);

      // this.postService.updatePost(updatedPost).subscribe(
      //   (response) => {
      //     console.log('Post updated successfully:', response);
      //     this.router.navigate(['/posts']); // Navigeren naar de lijst met posts
      //   },
      //   (error) => {
      //     console.error('Error updating post:', error);
      //   }
      // );
    } else {
      console.log('Form is not valid');
    }
  }
}
