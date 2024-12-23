package be.pxl.services.client;

import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.domain.dto.ReviewResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "comment-service")
public interface CommentClient {
    @GetMapping("/api/comment/post/{postId}")
    List<CommentResponse> getCommentsByPostId(@PathVariable Long postId);

    @DeleteMapping("/api/comment/post/{postId}")
    void deleteCommentsByPostId(@PathVariable Long postId);
}
