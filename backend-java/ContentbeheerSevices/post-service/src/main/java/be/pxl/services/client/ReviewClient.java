package be.pxl.services.client;

import be.pxl.services.domain.dto.ReviewResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "review-service")
public interface ReviewClient {
    @GetMapping("/api/review/post/{postId}")
    List<ReviewResponse> getReviewsByPostId(@PathVariable Long postId);

    @DeleteMapping("/api/review/post/{postId}")
    void deleteReviewsByPostId(@PathVariable Long postId);
}