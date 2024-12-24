package be.pxl.services.services;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private final ReviewRepository reviewRepository;

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);
    @Override
    public List<ReviewResponse> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return reviews.stream().map(this::mapToReviewResponse).toList();
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .reviewStatus(review.getReviewStatus())
                .reviewMessage(review.getReviewMessage())
                .postId(review.getPostId())
                .build();
    }

    @Override
    public void  addReview(ReviewRequest reviewRequest) {
        Review review = Review.builder()
                .reviewMessage(reviewRequest.getReviewMessage())
                .reviewStatus(reviewRequest.getReviewStatus())
                .postId(reviewRequest.getPostId())
                .build();

        try {
            Review savedReview = reviewRepository.save(review);
            reviewRequest.setId(savedReview.getId());
        } catch (Exception e) {
            throw new RuntimeException("Error saving review: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ReviewResponse> getReviewsByPostId(Long postId) {

        List<Review> reviews = reviewRepository.findAllByPostId(postId);
        return reviews.stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReviewsByPostId(Long postId) {
        List<Review> reviews = reviewRepository.findAllByPostId(postId);
        reviewRepository.deleteAll(reviews);
    }
}
