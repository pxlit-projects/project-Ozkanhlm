package be.pxl.services.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.messaging.CommentMessageProducer;
import be.pxl.services.repository.CommentRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.expression.ExpressionException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {

    private final CommentRepository commentRepository;
    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);
    private final CommentMessageProducer commentMessageProducer;
    @Override
    public List<CommentResponse> getAllComments() {
         List<Comment> comments = commentRepository.findAll();
         return comments.stream().map(this::mapToCommentResponse).toList();
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .user(comment.getUser())
                .comment(comment.getComment())
                .postId(comment.getPostId())
                .build();
    }

    @Override
    public CommentResponse addComment(CommentRequest commentRequest) {
        Comment comment = Comment.builder()
                .user(commentRequest.getUser())
                .comment(commentRequest.getComment())
                .postId(commentRequest.getPostId())
                .build();

          try {
              Comment savedComment = commentRepository.save(comment);
              commentRequest.setId(savedComment.getId());
              logger.info("Added Comment: {}", savedComment);

              try {
                  commentMessageProducer.sendMessage(commentRequest);
              } catch (Exception e) {
                  logger.error("Error sending message for comment: {}", e.getMessage(), e);
                  throw new RuntimeException("Error sending message for comment: " + e.getMessage(), e);
              }

              return mapToCommentResponse(savedComment);

          } catch (Exception e) {
              logger.error("Error saving comment: {}", e.getMessage(), e);
              throw new RuntimeException("Error saving comment: " + e.getMessage(), e);
        }
    }
    @Override
    public List<CommentResponse> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findAllByPostId(postId);

        return comments.stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCommentsByPostId(Long postId) {
        try {
            List<Comment> comments = commentRepository.findAllByPostId(postId);
            commentRepository.deleteAll(comments);
            logger.info("Deleted comments: {}", comments);
        } catch (Exception e) {
            logger.error("Error deleting comments for postId {}: {}", postId, e.getMessage(), e);
            throw new RuntimeException("Error deleting comments for postId " + postId, e);
        }
    }

    @Override
    public CommentResponse updateComment(Long commentId, CommentRequest commentRequest) {
        try {
            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new RuntimeException("Comment not found"));
            comment.setComment(commentRequest.getComment());
            Comment updatedComment = commentRepository.save(comment);

            logger.info("Updated comment: {}", updatedComment);

            return mapToCommentResponse(updatedComment);
        } catch (Exception e) {
            logger.error("Error updating comment with id {}: {}", commentId, e.getMessage(), e);
            throw new RuntimeException("Error updating comment", e);
        }
    }

    @Override
    public void deleteCommentById(Long commentId) {
        try {
            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
            commentRepository.delete(comment);

            logger.info("Deleted comment: {}", comment);
        } catch (Exception e) {
            logger.error("Error deleting comment with id {}: {}", commentId, e.getMessage(), e);
            throw new RuntimeException("Error deleting comment", e);
        }
    }
}
