package be.pxl.services.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {

    private final CommentRepository commentRepository;

    @Override
    public List<CommentResponse> getAllComments() {
         List<Comment> comments = commentRepository.findAll();
         return comments.stream().map(comment -> mapToCommentResponse(comment)).toList();
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .titel(comment.getNote())
                .build();
    }

    @Override
    public void addComment(CommentRequest commentRequest) {
        Comment comment = Comment.builder()
                .note(commentRequest.getTitel())
                .build();
        commentRepository.save(comment);
    }
}
