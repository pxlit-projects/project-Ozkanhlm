import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CommentService } from './comment.service';
import { Comment } from '../models/comment.model';

describe('CommentService', () => {
  let service: CommentService;
  let httpTestingController: HttpTestingController;

  const mockComment: Comment = {
    id: 1,
    user: 'gebruiker',
    comment: 'This is a test comment.',
    postId: 101,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CommentService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CommentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Chek afhandeling van requesten
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a comment', () => {
    service.addComment(mockComment).subscribe((comment) => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpTestingController.expectOne(service.api);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockComment);

    req.flush(mockComment);
  });

  it('should delete a comment', () => {
    service.deleteComment(mockComment.id).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(
      `${service.api}/${mockComment.id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
