import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostService } from '../../../shared/services/post.service';
import { Post } from '../../../shared/models/post.model';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css',
})
export class AddPostComponent {
  categories: string[] = [];
  statuses: string[] = [];

  fb: FormBuilder = inject(FormBuilder);

  postService: PostService = inject(PostService);
  router: any;

  ngOnInit(): void {
    this.postService.getCategories().subscribe((data) => {
      this.categories = data;
    });

    this.postService.getStatuses().subscribe((data) => {
      this.statuses = data;
    });
  }

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    picture: ['https://picsum.photos/200/300', [Validators.required]],
    content: ['', [Validators.required]],
    author: ['', Validators.required],
    category: ['', Validators.required],
    status: ['', Validators.required],
  });

  onSubmit() {
    const newPost: Post = {
      ...this.postForm.value,
    };

    console.log(newPost, 'newPost');

    this.postService.addPost(newPost).subscribe(() => {
      this.postForm.reset();
      this.router.navigate(['/posts']);
    });
  }
}
