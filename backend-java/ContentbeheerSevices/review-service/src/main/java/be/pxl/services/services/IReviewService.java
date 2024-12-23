package be.pxl.services.services;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.domain.dto.ReviewResponse;

import java.util.List;

public interface IReviewService {
    List<ReviewResponse> getAllReviews();
    void addReview(ReviewRequest postRequest);
    List<ReviewResponse> getReviewsByPostId(Long postId);
    void deleteReviewsByPostId(Long postId);
}
