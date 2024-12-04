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
    private final NotificationClient notificationClient;
    @Override
    public List<ReviewResponse> getAllReviews() {
         List<Review> reviews = reviewRepository.findAll();
         return reviews.stream().map(review -> mapToReviewResponse(review)).toList();
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        return ReviewResponse.builder()
                .titel(review.getComment())
                .build();
    }

    @Override
    public void addReview(ReviewRequest reviewRequest) {
        Review review = Review.builder()
                .comment(reviewRequest.getTitel())
                .build();
        reviewRepository.save(review);

        NotificationRequest notificationRequest =
                NotificationRequest.builder()
                        .message("Review Created")
                        .sender("Ozkan")
                        .build();
        notificationClient.sendNotification(notificationRequest);


    }
}
