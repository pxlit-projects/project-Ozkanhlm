import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { Post } from '../models/post.model';
import { Filter } from '../models/filter.model';

describe('FilterService', () => {
  let service: FilterService;
  let posts: Post[];

  beforeEach(() => {
    posts = [
      {
        id: 1,
        title: 'Post 1',
        picture: '',
        content: 'This is the first post',
        author: 'Author A',
        status: 'PUBLISH',
        category: 'ANNOUNCEMENTS',
        createdDate: '2023-12-01',
        comments: [],
        reviews: [],
      },
      {
        id: 2,
        title: 'Post 2',
        picture: '',
        content: 'This is the second post',
        author: 'Author B',
        status: 'CONCEPT',
        category: 'EVENTS',
        createdDate: '2023-12-02',
        comments: [],
        reviews: [],
      },
      {
        id: 3,
        title: 'Post 3',
        picture: '',
        content: 'This is a third post',
        author: 'Author A',
        status: 'PENDING',
        category: 'UPDATES',
        createdDate: '2023-12-03',
        comments: [],
        reviews: [],
      },
    ];

    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter posts by content', () => {
    const filter: Filter = {
      content: 'third',
      title: '',
      author: '',
      createdDate: null,
    };
    const filteredPosts = service.filterPosts(posts, filter);
    expect(filteredPosts.length).toBe(1);
    expect(filteredPosts[0].title).toBe('Post 3');
  });

  it('should filter posts by author', () => {
    const filter: Filter = {
      author: 'Author A',
      title: '',
      content: '',
      createdDate: null,
    };
    const filteredPosts = service.filterPosts(posts, filter);
    expect(filteredPosts.length).toBe(2);
    expect(filteredPosts[0].author).toBe('Author A');
    expect(filteredPosts[1].author).toBe('Author A');
  });
});
