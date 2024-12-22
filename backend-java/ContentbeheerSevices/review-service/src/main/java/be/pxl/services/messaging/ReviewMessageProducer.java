package be.pxl.services.messaging;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.ReviewMessage;
import be.pxl.services.domain.dto.ReviewRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewMessageProducer {
    private final RabbitTemplate rabbitTemplate;

    public void sendMessage(ReviewRequest reviewRequest) {
        try {
            ReviewMessage reviewMessage = ReviewMessage.builder()
                    .id(reviewRequest.getId())
                    .reviewStatus(reviewRequest.getReviewStatus())
                    .reviewMessage(reviewRequest.getReviewMessage())
                    .postId(reviewRequest.getPostId())
                    .build();

            rabbitTemplate.convertAndSend("postReviewQueue", reviewMessage);
            System.out.println("Message sent to RabbitMQ: " + reviewMessage);
        } catch (Exception e) {
            System.err.println("Failed to send message to RabbitMQ: " + e.getMessage());
            throw e;
        }
    }
}
