import { Component, inject, OnInit } from '@angular/core';
import { RoleService } from '../../../shared/services/role.service';
import { PostService } from '../../../shared/services/post.service';
import { Post } from '../../../shared/models/post.model';
import { FilterComponent } from '../filter/filter.component';
import { Filter } from '../../../shared/models/filter.model';
import { PostCardComponent } from '../post-card/post-card.component';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
  selector: 'app-workbanch',
  standalone: true,
  imports: [FilterComponent, PostCardComponent],
  templateUrl: './workbanch.component.html',
  styleUrls: ['./workbanch.component.css'],
})
export class WorkbanchComponent implements OnInit {
  allPosts: Post[] = [];
  pendingPosts: Post[] = [];
  conceptPosts: Post[] = [];
  postService: PostService = inject(PostService);
  roleService: RoleService = inject(RoleService);
  filterService: FilterService = inject(FilterService);

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
    const filteredPosts = this.filterService.filterPosts(this.allPosts, filter);
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
}
