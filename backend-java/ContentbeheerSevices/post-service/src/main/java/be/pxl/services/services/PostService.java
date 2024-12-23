package be.pxl.services.services;

import be.pxl.services.client.NotificationClient;
import be.pxl.services.client.ReviewClient;
import be.pxl.services.domain.Category;
import be.pxl.services.domain.dto.*;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.Status;
import be.pxl.services.repository.PostRepository;
import feign.FeignException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {

    private final PostRepository postRepository;
    private final NotificationClient notificationClient;
    private final ReviewClient reviewClient;
    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    @Override
    public List<PostResponse> getAllPosts() {
         List<Post> posts = postRepository.findAll();
         return posts.stream().map(post -> mapToPostResponse(post)).toList();
    }

    private PostResponse mapToPostResponse(Post post) {

        List<ReviewResponse> reviews;
        try {
            reviews = reviewClient.getReviewsByPostId(post.getId());
        } catch (Exception e) {
            logger.error("Error fetching reviews for post {}: {}", post.getId(), e.getMessage());
            reviews = Collections.emptyList();
        }

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .picture(post.getPicture())
                .content(post.getContent())
                .author(post.getAuthor())
                .status(post.getStatus())
                .category(post.getCategory())
                .comments(post.getComments())
                .reviews(reviews)
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
                .reviewIds(postRequest.getReviewIds())
                .build();
        postRepository.save(post);
    }

    @Override
    public PostResponse findPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("No post with id [" + postId + "]"));

        List<ReviewResponse> reviews;
        try {
            reviews = reviewClient.getReviewsByPostId(postId);
        } catch (FeignException.NotFound e) {
            logger.warn("No reviews found for post {}", postId);
            reviews = Collections.emptyList();
        } catch (FeignException e) {
            logger.error("Error fetching reviews for post {}: {}", postId, e.getMessage());
            reviews = Collections.emptyList();
        }

        logger.info("Found reviews for post {}: {}", postId, reviews);

        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getPicture(),
                post.getContent(),
                post.getAuthor(),
                post.getStatus(),
                post.getCategory(),
                post.getComments(),
                reviews,
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
        post.setReviewIds(postRequest.getReviewIds());

        postRepository.save(post);

        return mapToPostResponse(post);
    }

    @Override
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("No post with id [" + postId + "]"));

        reviewClient.deleteReviewsByPostId(postId);

        postRepository.delete(post);
    }

    @Override
    public List<String> getCategories() {
        return Arrays.stream(Category.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getStatuses() {
        return Arrays.stream(Status.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateReviewPost(ReviewMessage reviewMessage) {

        Post post = postRepository.findById(reviewMessage.getPostId())
                .orElseThrow(() -> new NotFoundException("No post with id [" + reviewMessage.getPostId() + "]"));

        if (post.getReviewIds() == null) {
            post.setReviewIds(new ArrayList<>());
        }

        post.getReviewIds().add(reviewMessage.getId());
        postRepository.save(post);

        String notificationText = String.format(
                "New review status: %s --- Title: '%s'",
                reviewMessage.getReviewStatus(),
                post.getTitle()
        );

        NotificationRequest notificationRequest = NotificationRequest.builder()
                .text(notificationText)
                .subject("JavaProject")
                .to("ozkanhalim3600@gmail.com")
                .build();

        try {
            notificationClient.sendNotification(notificationRequest);

            logger.info("Email sent successfully to: " + notificationRequest.getTo());
        } catch (Exception e) {
            logger.error("Failed to send email: " + e.getMessage(), e);
        }
    }
}
