package be.pxl.services.services;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.domain.NotificationRequest;
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
//    private final NotificationClient notificationClient;
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
    public boolean addReview(ReviewRequest reviewRequest) {
        Review review = Review.builder()
                .reviewMessage(reviewRequest.getReviewMessage())
                .reviewStatus(reviewRequest.getReviewStatus())
                .postId(reviewRequest.getPostId())
                .build();

        reviewRepository.save(review);
        System.out.println("Review saved with ID: " + review.getId());

//        NotificationRequest notificationRequest = NotificationRequest.builder()
//                .message("Review Created")
//                .sender("Ozkan")
//                .build();
//        notificationClient.sendNotification(notificationRequest);

        return true;
    }

    @Override
    public List<Long> getReviewsByPostId(Long postId) {
        List<Long> reviews = reviewRepository.findByPostId(postId);
        return reviews;
    }
}
