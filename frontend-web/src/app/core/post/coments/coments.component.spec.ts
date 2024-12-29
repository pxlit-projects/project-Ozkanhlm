import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ComentsComponent } from './coments.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from '../../../shared/services/comment.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Comment } from '../../../shared/models/comment.model';
import { of } from 'rxjs';

describe('ComentsComponent', () => {
  let component: ComentsComponent;
  let fixture: ComponentFixture<ComentsComponent>;
  let commentService: jasmine.SpyObj<CommentService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    commentService = jasmine.createSpyObj('CommentService', [
      'addComment',
      'updateComment',
      'deleteComment',
    ]);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ComentsComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: CommentService, useValue: commentService },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new comment', fakeAsync(() => {
    const newComment: Comment = {
      id: 1,
      postId: 1,
      user: 'gebruiker',
      comment: 'Test Comment',
    };
    commentService.addComment.and.returnValue(of(newComment));

    component.id = 1;
    component.user = 'gebruiker';
    component.commentForm.patchValue({ comment: 'Test comment' });
    component.onSubmitComment();

    tick();

    expect(commentService.addComment).toHaveBeenCalled();
    expect(component.commentsSubject.value).toContain(newComment);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Comment succesvol toegevoed!',
      'Sluiten',
      jasmine.any(Object)
    );
  }));

  it('should update an existing comment', fakeAsync(() => {
    const existingComment: Comment = {
      id: 1,
      postId: 1,
      user: 'gebruiker',
      comment: 'Original comment',
    };
    const updatedComment: Comment = {
      ...existingComment,
      comment: 'Updated comment',
    };
    component.commentsSubject.next([existingComment]);
    commentService.updateComment.and.returnValue(of(updatedComment));

    component.editingCommentId = 1;
    component.user = 'gebruiker';
    component.commentForm.patchValue({ comment: 'Updated comment' });
    component.onSubmitComment();

    tick();

    expect(commentService.updateComment).toHaveBeenCalled();
    expect(component.commentsSubject.value[0]).toEqual(updatedComment);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Comment succesvol Bijgewerkt!',
      'Sluiten',
      jasmine.any(Object)
    );
  }));

  it('should delete a comment', fakeAsync(() => {
    const commentToDelete: Comment = {
      id: 1,
      postId: 1,
      user: 'testUser',
      comment: 'Comment to delete',
    };
    component.commentsSubject.next([commentToDelete]);
    commentService.deleteComment.and.returnValue(of(void 0));

    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteComment(1);

    tick();

    expect(commentService.deleteComment).toHaveBeenCalledWith(1);
    expect(component.commentsSubject.value).not.toContain(commentToDelete);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Comment succesvol Verwijderd!',
      'Sluiten',
      jasmine.any(Object)
    );
  }));
});
