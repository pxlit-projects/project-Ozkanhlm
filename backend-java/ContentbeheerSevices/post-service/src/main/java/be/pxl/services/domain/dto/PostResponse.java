package be.pxl.services.domain.dto;

import be.pxl.services.domain.Category;
import be.pxl.services.domain.Comment;
import be.pxl.services.domain.Review;
import be.pxl.services.domain.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String picture;
    private String content;
    private String author;
    private Status status;
    private Category category;
    private List<Comment> comments;
    private List<Long> reviews;
    private LocalDateTime createdDate;
}
