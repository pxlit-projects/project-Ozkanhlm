import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkbanchComponent } from './workbanch.component';
import { of } from 'rxjs';
import { PostService } from '../../../shared/services/post.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('WorkbanchComponent', () => {
  let component: WorkbanchComponent;
  let fixture: ComponentFixture<WorkbanchComponent>;

  const postServiceMock = {
    getPosts: jasmine.createSpy().and.returnValue(of([])),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkbanchComponent, BrowserAnimationsModule],
      providers: [
        { provide: PostService, useValue: postServiceMock },
        provideNativeDateAdapter(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkbanchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch posts on init', () => {
    postServiceMock.getPosts.and.returnValue(
      of([
        { id: 1, status: 'CONCEPT' },
        { id: 2, status: 'PENDING' },
      ])
    );

    component.ngOnInit();

    expect(postServiceMock.getPosts).toHaveBeenCalled();
    expect(component.conceptPosts.length).toBe(1);
    expect(component.pendingPosts.length).toBe(1);
  });
});
