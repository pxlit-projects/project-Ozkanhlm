package be.pxl.services.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;

import java.util.List;

public interface ICommentService {
    List<CommentResponse> getAllComments();
    CommentResponse addComment(CommentRequest postRequest);
    List<CommentResponse> getCommentsByPostId(Long postId);
    void deleteCommentsByPostId(Long postId);
    CommentResponse updateComment(Long commentId, CommentRequest commentRequest);

    void deleteCommentById(Long commentId);
}
