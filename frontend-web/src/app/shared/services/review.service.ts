import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  api: string = environment.apiUrl + 'review/api/review';
  http: HttpClient = inject(HttpClient);

  addReview(review: Review): Observable<string> {
    return this.http.post<string>(this.api, review, {
      responseType: 'text' as 'json',
    });
  }
}
