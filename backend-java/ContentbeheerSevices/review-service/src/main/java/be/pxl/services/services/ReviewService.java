package be.pxl.services.services;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public List<ReviewResponse> getAllReviews() {
         List<Review> reviews = reviewRepository.findAll();
         return reviews.stream().map(review -> mapToReviewResponse(review)).toList();
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .titel(review.getTitel())
                .build();
    }

    @Override
    public void addReview(ReviewRequest reviewRequest) {
        Review review = Review.builder()
                .titel(reviewRequest.getTitel())
                .build();
        reviewRepository.save(review);
    }
}
