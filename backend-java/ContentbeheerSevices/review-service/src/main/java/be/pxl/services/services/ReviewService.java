package be.pxl.services.services;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.messaging.ReviewMessageProducer;
import be.pxl.services.repository.ReviewRepository;
import jakarta.ws.rs.NotFoundException;
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
    private final ReviewMessageProducer reviewMessageProducer;

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
            logger.info("Added Review: {}", savedReview);

            try {
                reviewMessageProducer.sendMessage(reviewRequest);
            } catch (Exception e) {
                logger.error("Error sending message for review: {}", e.getMessage(), e);
                throw new RuntimeException("Error sending message for review: " + e.getMessage(), e);
            }

        } catch (Exception e) {
            logger.error("Error saving review: {}", e.getMessage(), e);
            throw new RuntimeException("Error saving review: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ReviewResponse> getReviewsByPostId(Long postId) {
        List<Review> reviews = getReviewsOrThrow(postId);

        return reviews.stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReviewsByPostId(Long postId) {
        List<Review> reviews = getReviewsOrThrow(postId);
        reviewRepository.deleteAll(reviews);
        logger.info("Deleted Reviews: {}", reviews);
    }

    private List<Review> getReviewsOrThrow(Long postId) {
        List<Review> reviews = reviewRepository.findAllByPostId(postId);

        if (reviews.isEmpty()) {
            logger.warn("No reviews found for postId: {}", postId);
            throw new NotFoundException("No reviews found for postId: " + postId);
        }

        return reviews;
    }
}
