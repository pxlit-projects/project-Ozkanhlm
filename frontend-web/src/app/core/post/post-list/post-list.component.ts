import { Component, inject, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoleService } from '../../../shared/services/role.service';

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
  roleService: RoleService = inject(RoleService);
  role = this.roleService.getRole();

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
    if (this.role === 'redacteur') {
      this.postForRole = this.posts.reverse();
    } else if (this.role === 'gebruiker') {
      this.postForRole = this.posts
        .filter((post) => post.status === 'PUBLISH')
        .reverse();
    }
  }
}
