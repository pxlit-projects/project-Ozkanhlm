package be.pxl.services.client;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.ReviewResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "review-service")
public interface ReviewClient {
//    @GetMapping("/{reviewId}")
//    Review getReviewById(@PathVariable Long reviewId);

    @GetMapping("/post/{postId}")
    List<Long> getReviewsByPostId(@PathVariable Long postId);
}