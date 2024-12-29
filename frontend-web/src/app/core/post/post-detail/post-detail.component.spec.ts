import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PostService } from '../../../shared/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Post } from '../../../shared/models/post.model';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    author: 'Test Author',
    category: 'EVENTS',
    status: 'PUBLISH',
    picture: '',
    reviews: [],
    comments: [],
    createdDate: '',
  };

  beforeEach(async () => {
    const postServiceSpyObj = jasmine.createSpyObj('PostService', [
      'getPost',
      'getCategories',
      'getStatuses',
      'updatePost',
      'deletePost',
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        PostDetailComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: PostService, useValue: postServiceSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: MatSnackBar, useValue: snackBarSpyObj },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    postServiceSpy.getPost.and.returnValue(of(mockPost));
    postServiceSpy.getCategories.and.returnValue(
      of(['NEWS', 'UPDATES', 'EVENTS', 'ANNOUNCEMENTS'])
    );
    postServiceSpy.getStatuses.and.returnValue(
      of(['PUBLISH', 'CONCEPT', 'PENDING'])
    );

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories and statuses on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(postServiceSpy.getCategories).toHaveBeenCalled();
    expect(postServiceSpy.getStatuses).toHaveBeenCalled();
    expect(component.categories).toEqual([
      'NEWS',
      'UPDATES',
      'EVENTS',
      'ANNOUNCEMENTS',
    ]);
    expect(component.statuses).toEqual(['PUBLISH', 'CONCEPT', 'PENDING']);
  }));

  it('should delete post when confirmed', fakeAsync(() => {
    postServiceSpy.deletePost.and.returnValue(of(void 0));
    spyOn(window, 'confirm').and.returnValue(true);

    component.id = 1;
    component.deletePost();
    tick();

    expect(postServiceSpy.deletePost).toHaveBeenCalledWith(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts']);
  }));

  it('should update post on valid form submission', fakeAsync(() => {
    postServiceSpy.updatePost.and.returnValue(of(mockPost));
    component.id = 1;
    component.postForm.patchValue({
      title: mockPost.title,
      content: mockPost.content,
      author: mockPost.author,
      category: mockPost.category,
      status: mockPost.status,
      picture: mockPost.picture,
    });

    component.onSubmit();
    tick();

    expect(postServiceSpy.updatePost).toHaveBeenCalledWith(
      1,
      jasmine.objectContaining({
        title: mockPost.title,
        content: mockPost.content,
        author: mockPost.author,
        category: mockPost.category,
        status: mockPost.status,
        picture: mockPost.picture,
      })
    );
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Post succesvol Bijgewerkt!',
      'Sluiten',
      {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      }
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/posts']);
  }));
});
