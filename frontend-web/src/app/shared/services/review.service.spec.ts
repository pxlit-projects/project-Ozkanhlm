import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Review } from '../models/review.model';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReviewService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ReviewService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Chek afhandeling van requesten
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('addReview', () => {
    it('should send a POST request to the correct API endpoint', () => {
      const mockReview: Review = {
        id: 1,
        reviewStatus: 'REJECTED',
        reviewMessage: 'Niet goed',
        postId: 152,
      };
      const mockResponse = 'Review added successfully';

      service.addReview(mockReview).subscribe((response) => {
        expect(response).toBe(mockResponse);
      });

      const req = httpTestingController.expectOne(service.api);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockReview);

      // Return the mock review data
      req.flush(mockResponse);
    });
  });
});
