import { Component, inject, OnInit } from '@angular/core';
import { RoleService } from '../../../shared/services/role.service';
import { PostService } from '../../../shared/services/post.service';
import { Post } from '../../../shared/models/post.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';
import { Filter } from '../../../shared/models/filter.model';

@Component({
  selector: 'app-workbanch',
  standalone: true,
  imports: [DatePipe, RouterLink, FilterComponent],
  templateUrl: './workbanch.component.html',
  styleUrls: ['./workbanch.component.css'],
})
export class WorkbanchComponent implements OnInit {
  allPosts: Post[] = [];
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
        this.allPosts = data.reverse();
        this.updateFilteredLists();
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      },
    });
  }

  handleFilter(filter: Filter) {
    const filteredPosts = this.allPosts.filter((post) => {
      const matchesContent = filter.content
        ? post.content.toLowerCase().includes(filter.content.toLowerCase())
        : true;

      const matchesAuthor = filter.author
        ? post.author.toLowerCase().includes(filter.author.toLowerCase())
        : true;

      const matchesTitle = filter.title
        ? post.title.toLowerCase().includes(filter.title.toLowerCase())
        : true;

      const matchesDate = filter.createdDate
        ? this.compareDates(post.createdDate, filter.createdDate)
        : true;

      return matchesContent && matchesAuthor && matchesDate && matchesTitle;
    });

    this.updateFilteredLists(filteredPosts);
  }
  private updateFilteredLists(filteredPosts: Post[] = this.allPosts): void {
    this.conceptPosts = filteredPosts.filter(
      (post) => post.status === 'CONCEPT'
    );
    this.pendingPosts = filteredPosts.filter(
      (post) => post.status === 'PENDING'
    );
  }

  private compareDates(postDate: string, filterDate: string): boolean {
    const postDateFormatted = new Date(postDate).toISOString().split('T')[0];
    return postDateFormatted === filterDate;
  }
}
