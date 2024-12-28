package be.pxl.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.repository.CommentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest(classes = CommentServiceApplication.class)
@Testcontainers
@AutoConfigureMockMvc
public class CommentServiceApplicationTests {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CommentRepository commentRepository;

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
        commentRepository.deleteAll();
    }

    @Test
    public void testGetComments() throws Exception {
        Comment comment1 = Comment.builder()
                .user("gebruiker")
                .comment("This is the first comment.")
                .postId(101L)
                .build();

        Comment comment2 = Comment.builder()
                .user("redacteur")
                .comment("This is the second comment.")
                .postId(102L)
                .build();

        commentRepository.save(comment1);
        commentRepository.save(comment2);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/comment"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].user").value("gebruiker"))
                .andExpect(jsonPath("$[1].user").value("redacteur"));

    }

    @Test
    public void testAddComment() throws Exception {
        CommentRequest commentRequest = CommentRequest.builder()
                .user("gebruiker")
                .comment("This is a new comment.")
                .postId(103L)
                .build();

        mockMvc.perform(post("/api/comment")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user").value("gebruiker"))
                .andExpect(jsonPath("$.comment").value("This is a new comment."))
                .andExpect(jsonPath("$.postId").value(103));


        List<Comment> comments = commentRepository.findAll();
        assertEquals(1, comments.size());
        assertEquals("gebruiker", comments.get(0).getUser());
    }

    @Test
    public void testGetCommentsByPostId() throws Exception {
        Comment comment1 = Comment.builder()
                .user("gebruiker")
                .comment("This is a comment for post 101.")
                .postId(101L)
                .build();
        Comment comment2 = Comment.builder()
                .user("gebruiker")
                .comment("This is a comment for post 101.")
                .postId(101L)
                .build();
        Comment comment3 = Comment.builder()
                .user("redacteur")
                .comment("This is a comment for post 102.")
                .postId(102L)
                .build();

        commentRepository.save(comment1);
        commentRepository.save(comment2);
        commentRepository.save(comment3);

        mockMvc.perform(get("/api/comment/post/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].user").value("gebruiker"))
                .andExpect(jsonPath("$[1].user").value("gebruiker"));
    }

    @Test
    public void testUpdateComment() throws Exception {
        Comment comment = Comment.builder()
                .user("gebruiker")
                .comment("Old comment text")
                .postId(101L)
                .build();
        commentRepository.save(comment);

        CommentRequest updateRequest = CommentRequest.builder()
                .comment("Updated comment text")
                .build();

        mockMvc.perform(put("/api/comment/{id}", comment.getId())
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk());

        Comment updatedComment = commentRepository.findById(comment.getId()).orElseThrow();
        assertEquals("Updated comment text", updatedComment.getComment());
    }

    @Test
    public void testDeleteCommentById() throws Exception {
        Comment comment = Comment.builder()
                .user("gebruiker")
                .comment("This is a comment to delete.")
                .postId(101L)
                .build();
        commentRepository.save(comment);

        assertEquals(1, commentRepository.count());

        mockMvc.perform(delete("/api/comment/{id}", comment.getId()))
                .andExpect(status().isNoContent());

        assertEquals(0, commentRepository.count());
    }

    @Test
    public void testDeleteCommentsByPostId() throws Exception {
        Comment comment1 = Comment.builder()
                .user("gebruiker")
                .comment("Comment for post 101.")
                .postId(101L)
                .build();
        Comment comment2 = Comment.builder()
                .user("gebruiker")
                .comment("Another comment for post 101.")
                .postId(101L)
                .build();
        commentRepository.save(comment1);
        commentRepository.save(comment2);

        List<Comment> addedComments = commentRepository.findAllByPostId(101L);
        assertEquals(2, addedComments.size());

        mockMvc.perform(delete("/api/comment/post/{postId}", 101L))
                .andExpect(status().isNoContent());

        List<Comment> remainingComments = commentRepository.findAllByPostId(101L);
        assertEquals(0, remainingComments.size());
    }
}
