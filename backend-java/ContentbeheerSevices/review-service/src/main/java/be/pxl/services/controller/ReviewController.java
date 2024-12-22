package be.pxl.services.controller;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.messaging.ReviewMessageProducer;
import be.pxl.services.services.IReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<List<Long>> getReviewsByPostId(@PathVariable Long postId) {
        List<Long> reviews = reviewService.getReviewsByPostId(postId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<String> addReview(@RequestBody ReviewRequest reviewRequest) {
        boolean isReviewSaved = reviewService.addReview(reviewRequest);

        if (isReviewSaved) {
            try {
                reviewMessageProducer.sendMessage(reviewRequest);
            } catch (Exception e) {
                return new ResponseEntity<>("Review saved, but failed to send message to RabbitMQ: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>("Post added successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Post not saved", HttpStatus.NOT_FOUND);
        }
    }
}
