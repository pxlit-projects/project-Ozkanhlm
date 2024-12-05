import { Component, inject, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  postService: PostService = inject(PostService);

  // constructor(private postService: PostService) {}

  ngOnInit(): void {
    // this.fetchData();
    this.postService.getPosts().subscribe((data: Post[]) => {
      console.log(data, 'DATA');
      this.posts = data;
    });
  }
}

// fetchData(): void {
//   this.postService.getPosts().subscribe({
//     next: (posts) => {
//       this.posts = posts;
//     },
//   });
// }
