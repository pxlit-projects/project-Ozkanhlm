package be.pxl.services;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.ReviewStatus;
import be.pxl.services.domain.dto.ReviewRequest;

import be.pxl.services.repository.ReviewRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = ReviewServiceApplication.class)
@Testcontainers
@AutoConfigureMockMvc
public class ReviewServiceApplicationTests {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ReviewRepository reviewRepository;

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
        reviewRepository.deleteAll();
    }

    @Test
    public void testAddReview() throws Exception {
        ReviewRequest reviewRequest = new ReviewRequest();
        reviewRequest.setPostId(1L);
        reviewRequest.setReviewStatus(ReviewStatus.APPROVED);
        reviewRequest.setReviewMessage("This is a great post!");

        mockMvc.perform(post("/api/review")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string("Review added successfully"));

        List<Review> reviews = reviewRepository.findAll();
        assertEquals(1, reviews.size());
        assertEquals("This is a great post!", reviews.get(0).getReviewMessage());
    }

    @Test
    public void testGetAllReviews() throws Exception {
        Review review1 = new Review();
        review1.setPostId(1L);
        review1.setReviewMessage("Review 1");
        review1.setReviewStatus(ReviewStatus.APPROVED);
        reviewRepository.save(review1);

        Review review2 = new Review();
        review2.setPostId(2L);
        review2.setReviewMessage("Review 2");
        review2.setReviewStatus(ReviewStatus.REJECTED);
        reviewRepository.save(review2);

        mockMvc.perform(get("/api/review"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].reviewMessage").value("Review 1"))
                .andExpect(jsonPath("$[0].reviewStatus").value("APPROVED"))
                .andExpect(jsonPath("$[1].reviewMessage").value("Review 2"))
                .andExpect(jsonPath("$[1].reviewStatus").value("REJECTED"));
    }

    @Test
    public void testGetReviewsByPostId() throws Exception {
        Review review1 = new Review();
        review1.setPostId(1L);
        review1.setReviewMessage("Review 1");
        review1.setReviewStatus(ReviewStatus.APPROVED);
        reviewRepository.save(review1);

        Review review2 = new Review();
        review2.setPostId(1L);
        review2.setReviewMessage("Review 2");
        review2.setReviewStatus(ReviewStatus.REJECTED);
        reviewRepository.save(review2);

        mockMvc.perform(get("/api/review/post/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void testDeleteReviewsByPostId() throws Exception {
        Review review1 = new Review();
        review1.setPostId(1L);
        review1.setReviewMessage("Review 1");
        review1.setReviewStatus(ReviewStatus.APPROVED);
        reviewRepository.save(review1);

        Review review2 = new Review();
        review2.setPostId(1L);
        review2.setReviewMessage("Review 2");
        review2.setReviewStatus(ReviewStatus.REJECTED);
        reviewRepository.save(review2);

        mockMvc.perform(delete("/api/review/post/1"))
                .andExpect(status().isNoContent());

        List<Review> reviews = reviewRepository.findAllByPostId(1L);
        assertEquals(0, reviews.size());
    }
}
