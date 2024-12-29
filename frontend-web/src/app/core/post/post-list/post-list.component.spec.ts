import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { PostListComponent } from './post-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PostService } from '../../../shared/services/post.service';
import { Post } from '../../../shared/models/post.model';
import { provideNativeDateAdapter } from '@angular/material/core';
import { of } from 'rxjs';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;

  const mockPosts: Post[] = [
    {
      id: 1,
      title: 'Post 1',
      content: 'Content 1',
      author: 'Ozkan',
      category: 'EVENTS',
      status: 'PUBLISH',
      createdDate: '2023-12-29',
      picture: '',
      reviews: [],
    },
    {
      id: 2,
      title: 'Post 2',
      content: 'Content 2',
      author: 'Halim',
      category: 'EVENTS',
      status: 'PUBLISH',
      createdDate: '2023-12-29',
      picture: '',
      reviews: [],
    },
    {
      id: 3,
      title: 'Post 3',
      content: 'Content 3',
      author: 'Random',
      category: 'EVENTS',
      status: 'PUBLISH',
      createdDate: '2023-12-29',
      picture: '',
      reviews: [],
    },
  ];

  beforeEach(async () => {
    const postServiceSpyObj = jasmine.createSpyObj('PostService', ['getPosts']);

    await TestBed.configureTestingModule({
      imports: [PostListComponent],
      providers: [
        provideNativeDateAdapter(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PostService, useValue: postServiceSpyObj },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch posts', fakeAsync(() => {
    postServiceSpy.getPosts.and.returnValue(of(mockPosts));
    component.ngOnInit();

    tick();

    expect(postServiceSpy.getPosts).toHaveBeenCalled();
    expect(component.allPosts.length).toBe(3);
    expect(component.posts.length).toBe(3);
    console.log(component.posts);
    expect(component.posts[0].id).toBe(3);
    expect(component.posts[1].id).toBe(2);
    expect(component.posts[2].id).toBe(1);
  }));
});
