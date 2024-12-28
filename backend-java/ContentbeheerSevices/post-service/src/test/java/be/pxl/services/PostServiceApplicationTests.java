package be.pxl.services;

import be.pxl.services.client.CommentClient;
import be.pxl.services.client.NotificationClient;
import be.pxl.services.client.ReviewClient;
import be.pxl.services.domain.Category;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.ReviewStatus;
import be.pxl.services.domain.Status;
import be.pxl.services.domain.dto.CommentMessage;
import be.pxl.services.domain.dto.NotificationRequest;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.ReviewMessage;
import be.pxl.services.repository.PostRepository;
import static org.junit.jupiter.api.Assertions.*;
import be.pxl.services.services.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest(classes = PostServiceApplication.class)
@Testcontainers
@AutoConfigureMockMvc
public class PostServiceApplicationTests{
    @Autowired
    MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private PostRepository postRepository;

    @Container
    private static MySQLContainer sqlContainer =
            new MySQLContainer("mysql:5.7.37");

    @DynamicPropertySource
    static void registerMySQLProperties(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username",sqlContainer::getUsername );
        registry.add("spring.datasource.password", sqlContainer::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
    }

    @BeforeEach
    public void setUp() {
        postRepository.deleteAll();
    }

    @Test
    public void testGetCategories() throws Exception {
        mockMvc.perform(get("/api/post/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(Category.values().length));
    }

    @Test
    public void testGetStatuses() throws Exception {
        mockMvc.perform(get("/api/post/statuses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(Status.values().length));
    }
    @Test
    public void testAddPost() throws Exception {
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("Title");
        postRequest.setPicture("");
        postRequest.setContent("This is post content.");
        postRequest.setAuthor("Ozkan Halim");
        postRequest.setStatus(Status.PUBLISH);
        postRequest.setCategory(Category.EVENTS);

        mockMvc.perform(post("/api/post")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isCreated());

        assertEquals(1, postRepository.findAll().size());
    }

    @Test
    public void testGetAllPosts() throws Exception {
        Post post1 = new Post();
        post1.setTitle("Post 1");
        post1.setContent("Content 1");
        post1.setAuthor("Author 1");
        post1.setStatus(Status.PUBLISH);
        post1.setCategory(Category.EVENTS);
        postRepository.save(post1);

        Post post2 = new Post();
        post2.setTitle("Post 2");
        post2.setContent("Content 2");
        post2.setAuthor("Author 2");
        post2.setStatus(Status.CONCEPT);
        post2.setCategory(Category.NEWS);
        postRepository.save(post2);

        mockMvc.perform(get("/api/post"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Post 1"))
                .andExpect(jsonPath("$[1].title").value("Post 2"));
    }

    @Test
    public void testFindPostById() throws Exception {
        Post post = new Post();
        post.setTitle("Post Title");
        post.setContent("Post Content");
        post.setAuthor("Halim");
        post.setStatus(Status.CONCEPT);
        post.setCategory(Category.UPDATES);
        postRepository.save(post);

        mockMvc.perform(get("/api/post/{postId}", post.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Post Title"))
                .andExpect(jsonPath("$.content").value("Post Content"));
    }

    @Test
    public void testUpdatePost() throws Exception {
        Post post = new Post();
        post.setTitle("Old Title");
        post.setContent("Old Content");
        post.setAuthor("Old Author");
        post.setStatus(Status.CONCEPT);
        post.setCategory(Category.UPDATES);
        postRepository.save(post);

        PostRequest updatedPostRequest = new PostRequest();
        updatedPostRequest.setTitle("New Title");
        updatedPostRequest.setContent("New Content");
        updatedPostRequest.setAuthor("New Author");
        updatedPostRequest.setStatus(Status.CONCEPT);
        updatedPostRequest.setCategory(Category.UPDATES);

        mockMvc.perform(put("/api/post/{postId}", post.getId())
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(updatedPostRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Title"))
                .andExpect(jsonPath("$.content").value("New Content"))
                .andExpect(jsonPath("$.author").value("New Author"));
    }

    @Test
    public void testDeletePost() throws Exception {
        Post post = new Post();
        post.setTitle("Title to be deleted");
        post.setContent("Content to be deleted");
        post.setAuthor("Author");
        post.setStatus(Status.PUBLISH);
        post.setCategory(Category.NEWS);
        postRepository.save(post);

        mockMvc.perform(delete("/api/post/{postId}", post.getId()))
                .andExpect(status().isNoContent());

        assertEquals(0, postRepository.findAll().size());
    }

    @Test
    @Transactional
    public void testUpdateReviewPost() throws Exception {
        Post post = new Post();
        post.setTitle("Post with reviews");
        post.setContent("Post content");
        post.setAuthor("Ozkan");
        post.setStatus(Status.PUBLISH);
        post.setCategory(Category.EVENTS);
        postRepository.save(post);


        ReviewMessage reviewMessage = new ReviewMessage();
        reviewMessage.setPostId(post.getId());
        reviewMessage.setId(1L);
        reviewMessage.setReviewStatus(ReviewStatus.APPROVED);

        NotificationClient mockNotificationClient = mock(NotificationClient.class);
        PostService postServiceWithMock = new PostService(postRepository, mockNotificationClient, mock(ReviewClient.class), mock(CommentClient.class));

        doNothing().when(mockNotificationClient).sendNotification(any(NotificationRequest.class));

        postServiceWithMock.updateReviewPost(reviewMessage);

        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();
        assertTrue(updatedPost.getReviewIds().contains(reviewMessage.getId()));

        verify(mockNotificationClient, times(1)).sendNotification(any(NotificationRequest.class));
    }

    @Test
    @Transactional
    public void testUpdateCommentPost() throws Exception {
        Post post = new Post();
        post.setTitle("Post with comments");
        post.setContent("Post content");
        post.setAuthor("Ozkan");
        post.setStatus(Status.PUBLISH);
        post.setCategory(Category.EVENTS);
        postRepository.save(post);

        CommentMessage commentMessage = new CommentMessage();
        commentMessage.setPostId(post.getId());
        commentMessage.setId(1L);
        commentMessage.setComment("Great post!");

        NotificationClient mockNotificationClient = mock(NotificationClient.class);
        PostService postServiceWithMock = new PostService(postRepository, mockNotificationClient, mock(ReviewClient.class), mock(CommentClient.class));

        doNothing().when(mockNotificationClient).sendNotification(any(NotificationRequest.class));

        postServiceWithMock.updateCommentPost(commentMessage);

        Post updatedPost = postRepository.findById(post.getId()).orElseThrow();
        assertTrue(updatedPost.getCommentIds().contains(commentMessage.getId()));

        verify(mockNotificationClient, times(1)).sendNotification(any(NotificationRequest.class));
    }
}
