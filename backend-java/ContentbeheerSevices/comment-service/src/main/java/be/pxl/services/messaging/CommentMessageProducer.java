package be.pxl.services.messaging;

import be.pxl.services.domain.dto.CommentMessage;
import be.pxl.services.domain.dto.CommentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentMessageProducer {
    private final RabbitTemplate rabbitTemplate;

    public void sendMessage(CommentRequest commentRequest) {
        try {
            CommentMessage commentMessage = CommentMessage.builder()
                    .id(commentRequest.getId())
                    .user(commentRequest.getUser())
                    .comment(commentRequest.getComment())
                    .postId(commentRequest.getPostId())
                    .build();

            rabbitTemplate.convertAndSend("postCommentQueue", commentMessage);
            System.out.println("Message sent to RabbitMQ: " + commentMessage);
        } catch (Exception e) {
            System.err.println("Failed to send message to RabbitMQ: " + e.getMessage());
            throw e;
        }
    }
}
