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
    private final ReviewMessageProducer reviewMessageProducer;

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
        try {
            reviewService.addReview(reviewRequest);
            try {
                reviewMessageProducer.sendMessage(reviewRequest);
            } catch (Exception e) {
                return new ResponseEntity<>("Review saved, but failed to send message to RabbitMQ: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>("Review added successfully", HttpStatus.OK);
        } catch (Exception e) {
            // If any error occurs in saving the review
            return new ResponseEntity<>("Failed to save review: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> deleteReviewsByPostId(@PathVariable Long postId) {
        reviewService.deleteReviewsByPostId(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
