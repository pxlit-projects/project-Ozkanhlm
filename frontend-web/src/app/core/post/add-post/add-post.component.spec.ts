import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPostComponent } from './add-post.component';
import { PostService } from '../../../shared/services/post.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Post } from '../../../shared/models/post.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let postService: PostService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddPostComponent,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'posts', component: AddPostComponent },
        ]),
      ],
      providers: [
        {
          provide: PostService,
          useValue: {
            getCategories: jasmine
              .createSpy()
              .and.returnValue(
                of(['NEWS', 'UPDATES', 'EVENTS', 'ANNOUNCEMENTS'])
              ),
            getStatuses: jasmine
              .createSpy()
              .and.returnValue(of(['PUBLISH', 'CONCEPT', 'PENDING'])),
            addPost: jasmine.createSpy().and.returnValue(of({})),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the form and call addPost method', (done) => {
    const post: Post = {
      id: 1,
      title: 'Test Title',
      picture: 'test-picture-url.jpg',
      content: 'Test Content',
      author: 'Test Author',
      status: 'PUBLISH',
      category: 'EVENTS',
      createdDate: '2023-12-29',
    };

    component.postForm.controls['title'].setValue(post.title);
    component.postForm.controls['content'].setValue(post.content);
    component.postForm.controls['picture'].setValue(post.picture);
    component.postForm.controls['author'].setValue(post.author);
    component.postForm.controls['category'].setValue(post.category);
    component.postForm.controls['status'].setValue(post.status);

    component.onSubmit();

    fixture.whenStable().then(() => {
      const expectedPost = {
        title: 'Test Title',
        picture: 'test-picture-url.jpg',
        content: 'Test Content',
        author: 'Test Author',
        status: 'PUBLISH',
        category: 'EVENTS',
      };

      expect(postService.addPost).toHaveBeenCalledWith(
        jasmine.objectContaining(expectedPost)
      );
      done();
    });
  });
});
