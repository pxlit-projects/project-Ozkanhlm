import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { Filter } from '../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  filterPosts(posts: Post[], filter: Filter): Post[] {
    return posts.filter((post) => {
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

  private compareDates(postDate: string, filterDate: Date): boolean {
    const postDateObject = new Date(postDate);

    const normalizedPostDate = new Date(
      postDateObject.getFullYear(),
      postDateObject.getMonth(),
      postDateObject.getDate()
    );

    const normalizedFilterDate = new Date(
      filterDate.getFullYear(),
      filterDate.getMonth(),
      filterDate.getDate()
    );

    return normalizedPostDate.getTime() === normalizedFilterDate.getTime();
  }
}
