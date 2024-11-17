package be.pxl.services.services;

import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;

import java.util.List;

public interface ICommentService {
    List<CommentResponse> getAllComments();

    void addComment(CommentRequest postRequest);
}
