import { Component, Input, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Comment } from '../../../shared/models/comment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommentService } from '../../../shared/services/comment.service';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-coments',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './coments.component.html',
  styleUrl: './coments.component.css',
})
export class ComentsComponent {
  @Input() comments: Comment[] = [];
  @Input() id: number | undefined;
  @Input() user: string | undefined;

  fb: FormBuilder = inject(FormBuilder);
  editingCommentId: number | null = null;
  commentService: CommentService = inject(CommentService);
  snackBar: MatSnackBar = inject(MatSnackBar);

  commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject.asObservable();

  commentForm: FormGroup = this.fb.group({
    comment: ['', Validators.required],
  });

  ngOnInit(): void {
    this.commentsSubject.next(this.comments || []);
  }

  onSubmitComment() {
    if (!this.commentForm.valid) {
      console.warn('Comment form is not valid');
      return;
    }

    const commentData: Comment = this.commentForm.value;
    commentData.postId = this.id || 0;
    commentData.user = this.user || '';

    if (this.editingCommentId) {
      this.commentService
        .updateComment(this.editingCommentId, commentData)
        .subscribe({
          next: (updatedComment) => {
            const currentComments = this.commentsSubject.value.map((comment) =>
              comment.id === this.editingCommentId ? updatedComment : comment
            );
            this.commentsSubject.next(currentComments);
            this.commentForm.reset();
            this.editingCommentId = null;
            this.snackBar.open('Comment succesvol Bijgewerkt!', 'Sluiten', {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
            });
          },
          error: (err) => console.error('Error updating comment:', err),
        });
    } else {
      this.commentService.addComment(commentData).subscribe({
        next: (newComment) => {
          const currentComments = this.commentsSubject.value;
          this.commentsSubject.next([...currentComments, newComment]);
          this.commentForm.reset();
          this.snackBar.open('Comment succesvol toegevoed!', 'Sluiten', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          });
        },
        error: (err) => console.error('Error adding comment:', err),
      });
    }
  }

  editComment(comment: Comment): void {
    if (comment.user === this.user) {
      this.editingCommentId = comment.id;
      this.commentForm.patchValue({
        comment: comment.comment,
      });
    }
  }

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => {
          const updatedComments = this.commentsSubject.value.filter(
            (comment) => comment.id !== commentId
          );
          this.commentsSubject.next(updatedComments);
          this.snackBar.open('Comment succesvol Verwijderd!', 'Sluiten', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          });
        },
        error: (err) => console.error('Error deleting comment:', err),
      });
    }
  }
}
