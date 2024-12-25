package be.pxl.services.controller;


import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.messaging.ReviewMessageProducer;
import be.pxl.services.services.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/review")
public class ReviewController {
    private final IReviewService reviewService;

    @GetMapping
    public ResponseEntity getReviews(){
        return new ResponseEntity(reviewService.getAllReviews(), HttpStatus.OK);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByPostId(@PathVariable Long postId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByPostId(postId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<String> addReview(@RequestBody ReviewRequest reviewRequest) {
        reviewService.addReview(reviewRequest);
        return new ResponseEntity<>("Review added successfully", HttpStatus.OK);

    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> deleteReviewsByPostId(@PathVariable Long postId) {
        reviewService.deleteReviewsByPostId(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
