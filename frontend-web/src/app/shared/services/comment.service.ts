import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  api: string = environment.apiUrl + 'comment/api/comment';
  http: HttpClient = inject(HttpClient);

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.api, comment);
  }

  updateComment(
    commentId: number,
    updatedComment: Comment
  ): Observable<Comment> {
    console.log('Update comment data:', updatedComment);
    return this.http.put<Comment>(`${this.api}/${commentId}`, updatedComment);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${commentId}`);
  }
}
