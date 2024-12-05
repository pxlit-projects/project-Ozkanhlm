import { Component, inject, OnInit } from '@angular/core';
import { RoleService } from '../../../shared/services/role.service';
import { PostService } from '../../../shared/services/post.service';
import { Post } from '../../../shared/models/post.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-workbanch',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './workbanch.component.html',
  styleUrls: ['./workbanch.component.css'],
})
export class WorkbanchComponent implements OnInit {
  pendingPosts: Post[] = [];
  conceptPosts: Post[] = [];
  postService: PostService = inject(PostService);
  roleService: RoleService = inject(RoleService);
  role = this.roleService.getRole();

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.postService.getPosts().subscribe({
      next: (data: Post[]) => {
        this.conceptPosts = data
          .filter((data) => data.status === 'CONCEPT')
          .reverse();

        this.pendingPosts = data
          .filter((data) => data.status === 'PENDING')
          .reverse();
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      },
    });
  }
}
