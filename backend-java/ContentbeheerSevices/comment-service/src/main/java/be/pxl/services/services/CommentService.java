package be.pxl.services.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.expression.ExpressionException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {

    private final CommentRepository commentRepository;

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
              return mapToCommentResponse(savedComment);

          } catch (Exception e) {
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
        List<Comment> comments = commentRepository.findAllByPostId(postId);
        commentRepository.deleteAll(comments);
    }

    @Override
    public CommentResponse updateComment(Long commentId, CommentRequest commentRequest) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ExpressionException("Comment not found"));


        comment.setComment(commentRequest.getComment());
        Comment updatedComment = commentRepository.save(comment);

        return mapToCommentResponse(updatedComment);
    }

    @Override
    public void deleteCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
        commentRepository.delete(comment);
    }
}
