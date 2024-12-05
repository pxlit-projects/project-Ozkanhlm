package be.pxl.services.services;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.domain.NotificationRequest;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.repository.PostRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {

    private final PostRepository postRepository;
    private final NotificationClient notificationClient;

    @Override
    public List<PostResponse> getAllPosts() {
         List<Post> posts = postRepository.findAll();
         return posts.stream().map(post -> mapToPostResponse(post)).toList();
    }

    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .picture(post.getPicture())
                .content(post.getContent())
                .author(post.getAuthor())
                .status(post.getStatus())
                .category(post.getCategory())
                .comments(post.getComments())
                .review(post.getReview())
                .createdDate(post.getCreatedDate())
                .build();
    }

    @Override
    public void addPost(PostRequest postRequest) {
        Post post = Post.builder()
                .title(postRequest.getTitle())
                .picture(postRequest.getPicture())
                .content(postRequest.getContent())
                .author(postRequest.getAuthor())
                .status(postRequest.getStatus())
                .category(postRequest.getCategory())
                .comments(postRequest.getComments())
                .review(postRequest.getReview())
                .build();
        postRepository.save(post);

        NotificationRequest notificationRequest =
                NotificationRequest.builder()
                        .message("Post Created")
                        .sender("Ozkan")
                        .build();
        notificationClient.sendNotification(notificationRequest);

    }

    @Override
    public PostResponse findPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("No post with id [" + postId + "]"));
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getPicture(),
                post.getContent(),
                post.getAuthor(),
                post.getStatus(),
                post.getCategory(),
                post.getComments(),
                post.getReview(),
                post.getCreatedDate()
        );
    }

    @Override
    public PostResponse updatePost(Long postId, PostRequest postRequest) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("No post with id [" + postId + "]"));

        post.setTitle(postRequest.getTitle());
        post.setPicture(postRequest.getPicture());
        post.setContent(postRequest.getContent());
        post.setAuthor(postRequest.getAuthor());
        post.setStatus(postRequest.getStatus());
        post.setCategory(postRequest.getCategory());
        post.setComments(postRequest.getComments());
        post.setReview(postRequest.getReview());

        postRepository.save(post);

        return mapToPostResponse(post);
    }

}
