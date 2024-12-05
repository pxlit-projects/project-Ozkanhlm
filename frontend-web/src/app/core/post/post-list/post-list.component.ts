import { Component, inject, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  postForRole: Post[] = [];
  postService: PostService = inject(PostService);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.postService.getPosts().subscribe({
      next: (data: Post[]) => {
        this.posts = data;

        this.loadPosts();
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      },
    });
  }

  loadPosts(): void {
    const role = localStorage.getItem('role');
    if (role === 'redacteur') {
      this.postForRole = this.posts.reverse();
    } else if (role === 'gebruiker') {
      this.postForRole = this.posts
        .filter((post) => post.status === 'PUBLISH')
        .reverse();
    }
  }
}
