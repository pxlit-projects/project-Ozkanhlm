import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PostService } from './post.service';
import { Post } from '../models/post.model';

describe('PostService', () => {
  let service: PostService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PostService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Chek afhandeling van requesten
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve posts from the API', () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Post 1',
        content: 'Content 1',
        picture: '',
        author: 'Ozkan',
        status: 'PUBLISH',
        category: 'ANNOUNCEMENTS',
        createdDate: '2024-12-29T12:00:00Z',
        comments: [],
        reviews: [],
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Content 2',
        picture: '',
        author: 'Ozkan',
        status: 'PUBLISH',
        category: 'ANNOUNCEMENTS',
        createdDate: '2024-12-29T12:00:00Z',
        comments: [],
        reviews: [],
      },
    ];

    service.getPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpTestingController.expectOne(service.api);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should send a DELETE request', () => {
    const postId = 1;

    service.deletePost(postId).subscribe();

    const req = httpTestingController.expectOne(`${service.api}/${postId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });

  it('should retrieve statuses', () => {
    const mockStatuses: string[] = ['PUBLISH', 'CONCEPT', 'PENDING'];

    service.getStatuses().subscribe((statuses) => {
      expect(statuses).toEqual(mockStatuses);
    });

    const req = httpTestingController.expectOne(`${service.api}/statuses`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStatuses);
  });

  it('should retrieve categories from the API', () => {
    const mockCategories: string[] = [
      'NEWS',
      'UPDATES',
      'EVENTS',
      'ANNOUNCEMENTS',
    ];

    service.getCategories().subscribe((categories) => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpTestingController.expectOne(`${service.api}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });
});
