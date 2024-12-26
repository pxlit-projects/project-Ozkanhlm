import { Component, inject, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { FilterComponent } from '../filter/filter.component';
import { Filter } from '../../../shared/models/filter.model';
import { PostCardComponent } from '../post-card/post-card.component';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [FilterComponent, PostCardComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  allPosts: Post[] = [];
  posts: Post[] = [];
  postService: PostService = inject(PostService);
  filterService: FilterService = inject(FilterService);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.postService.getPosts().subscribe({
      next: (data: Post[]) => {
        this.allPosts = data
          .filter((post) => post.status === 'PUBLISH')
          .reverse();

        this.posts = [...this.allPosts];
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      },
    });
  }
  handleFilter(filter: Filter) {
    this.posts = this.filterService.filterPosts(this.allPosts, filter);
  }
}
