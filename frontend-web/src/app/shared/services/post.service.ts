import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  api: string = environment.apiUrl + 'post/api/post';
  http: HttpClient = inject(HttpClient);

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.api);
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.api, post);
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.api}/${id}`, post);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.api}/${id}`);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.api + '/categories');
  }

  getStatuses(): Observable<string[]> {
    return this.http.get<string[]>(this.api + '/statuses');
  }
}
