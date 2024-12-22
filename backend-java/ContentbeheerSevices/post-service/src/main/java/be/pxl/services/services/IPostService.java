package be.pxl.services.services;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.domain.dto.ReviewMessage;

import java.util.List;

public interface IPostService {
    List<PostResponse> getAllPosts();
    void addPost(PostRequest postRequest);
    PostResponse findPostById(Long postId);
    PostResponse  updatePost(Long postId, PostRequest postRequest);
    void deletePost(Long postId);
    List<String> getCategories();
    List<String> getStatuses();

    void updateReviewPost(ReviewMessage reviewMessage);
}
