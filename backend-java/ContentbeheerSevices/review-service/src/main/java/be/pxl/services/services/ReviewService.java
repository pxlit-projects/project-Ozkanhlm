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

    private final ReviewRepository postRepository;

    @Override
    public List<ReviewResponse> getAllReviews() {
         List<Review> posts = postRepository.findAll();
         return posts.stream().map(post -> mapToPostResponse(post)).toList();
    }

    private ReviewResponse mapToPostResponse(Review post) {
        return ReviewResponse.builder()
                .titel(post.getTitel())
                .build();
    }

    @Override
    public void addReview(ReviewRequest postRequest) {
        Review post = Review.builder()
                .titel(postRequest.getTitel())
                .build();
        postRepository.save(post);
    }
}
