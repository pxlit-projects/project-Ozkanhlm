package be.pxl.services.services;

import be.pxl.services.client.CommentClient;
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
    private final CommentClient commentClient;
    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    @Override
    public List<PostResponse> getAllPosts() {
        try {
            List<Post> posts = postRepository.findAll();
            logger.info("Get all Posts: {}", posts);
            return posts.stream().map(this::mapToPostResponse).toList();
        } catch (Exception e) {
            logger.error("An error occurred while fetching all posts", e);
            throw new RuntimeException("Failed to fetch posts", e);
        }
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

    private List<ReviewResponse> fetchReviews(Long postId) {
        try {
            return reviewClient.getReviewsByPostId(postId);
        } catch (FeignException.NotFound e) {
            logger.warn("No reviews found for post {}", postId);
        } catch (Exception e) {
            logger.error("Error fetching reviews for post {}", postId);
        }
        return Collections.emptyList();
    }

    private List<CommentResponse> fetchComments(Long postId) {
        try {
            return commentClient.getCommentsByPostId(postId);
        } catch (FeignException.NotFound e) {
            logger.warn("No comments found for post {}", postId);
        } catch (Exception e) {
            logger.error("Error fetching comments for post {}: ", postId);
        }
        return Collections.emptyList();
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
                .comments(fetchComments(post.getId()))
                .reviews(fetchReviews(post.getId()))
                .createdDate(post.getCreatedDate())
                .build();
    }

    @Override
    public void addPost(PostRequest postRequest) {
        try {
            Post post = Post.builder()
                    .title(postRequest.getTitle())
                    .picture(postRequest.getPicture())
                    .content(postRequest.getContent())
                    .author(postRequest.getAuthor())
                    .status(postRequest.getStatus())
                    .category(postRequest.getCategory())
                    .commentIds(postRequest.getCommentIds())
                    .reviewIds(postRequest.getReviewIds())
                    .build();
            postRepository.save(post);

            logger.info("Post added with ID: {}", post.getId());
        } catch (Exception e) {
            logger.error("Error adding post: {}", e.getMessage(), e);
            throw new RuntimeException("Error adding post", e);
        }
    }


    private Post findPostOrThrow(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("No post with id [" + postId + "]"));
    }

    @Override
    public PostResponse findPostById(Long postId) {
        Post post = findPostOrThrow(postId);

        List<ReviewResponse> reviews = fetchReviews(postId);
        List<CommentResponse> comments = fetchComments(postId);

        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getPicture(),
                post.getContent(),
                post.getAuthor(),
                post.getStatus(),
                post.getCategory(),
                comments,
                reviews,
                post.getCreatedDate()
        );
    }

    @Override
    public PostResponse updatePost(Long postId, PostRequest postRequest) {
        Post post = findPostOrThrow(postId);

        post.setTitle(postRequest.getTitle());
        post.setPicture(postRequest.getPicture());
        post.setContent(postRequest.getContent());
        post.setAuthor(postRequest.getAuthor());
        post.setStatus(postRequest.getStatus());
        post.setCategory(postRequest.getCategory());
        post.setCommentIds(postRequest.getCommentIds());
        post.setReviewIds(postRequest.getReviewIds());

        postRepository.save(post);

        return mapToPostResponse(post);
    }

    @Override
    public void deletePost(Long postId) {
        Post post = findPostOrThrow(postId);

        try {
            reviewClient.deleteReviewsByPostId(postId);
            logger.info("Successfully deleted reviews for postId [{}].", postId);
        } catch (Exception e) {
            logger.error("Failed to delete reviews for postId [{}]: {}", postId, e.getMessage(), e);
        }

        try {
            commentClient.deleteCommentsByPostId(postId);
            logger.info("Successfully deleted comments for postId [{}].", postId);
        } catch (Exception e) {
            logger.error("Failed to delete comments for postId [{}]: {}", postId, e.getMessage(), e);
        }

        try {
            postRepository.delete(post);
            logger.info("Post with id [{}] deleted successfully.", postId);
        } catch (Exception e) {
            logger.error("Failed to delete post with id [{}]: {}", postId, e.getMessage(), e);
        }
    }

    @Transactional
    public void updateReviewPost(ReviewMessage reviewMessage) {
        Post post = findPostOrThrow(reviewMessage.getPostId());

        logger.info("ReviewMessage :{}", reviewMessage);

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
        sendNotification(notificationText);
    }

    @Transactional
    public void updateCommentPost(CommentMessage commentMessage) {
        Post post = findPostOrThrow(commentMessage.getPostId());

        if (post.getCommentIds() == null) {
            post.setCommentIds(new ArrayList<>());
        }

        post.getCommentIds().add(commentMessage.getId());
        postRepository.save(post);

        String notificationText = String.format(
                "New comment: %s --- Title: '%s'",
                commentMessage.getComment(),
                post.getTitle()
        );

        sendNotification(notificationText);
    }

    private void sendNotification(String notificationText) {
        NotificationRequest notificationRequest = NotificationRequest.builder()
                .text(notificationText)
                .subject("JavaProject")
                .to("ozkanhalim3600@gmail.com")
                .build();

        try {
            notificationClient.sendNotification(notificationRequest);
            logger.info("Email sent successfully to: {}", notificationRequest.getTo());
        } catch (Exception e) {
            logger.error("Failed to send email: {}", e.getMessage(), e);
        }
    }
}
