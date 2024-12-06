import { Component, inject, OnInit } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/post.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';
import { Filter } from '../../../shared/models/filter.model';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [DatePipe, RouterLink, FilterComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  allPosts: Post[] = [];
  posts: Post[] = [];
  postService: PostService = inject(PostService);

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
    this.posts = this.allPosts.filter((post) => {
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
  }

  private compareDates(postDate: string, filterDate: string): boolean {
    const postDateFormatted = new Date(postDate).toISOString().split('T')[0];
    return postDateFormatted === filterDate;
  }
}
