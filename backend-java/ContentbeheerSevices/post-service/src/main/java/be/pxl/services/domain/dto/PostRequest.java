package be.pxl.services.domain.dto;

import be.pxl.services.domain.Category;
import be.pxl.services.domain.Comment;
import be.pxl.services.domain.Review;
import be.pxl.services.domain.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    private String title;
    private String picture;
    private String content;
    private String author;
    private Status status;
    private Category category;
    private List<Long> commentIds;
    private List<Long> reviewIds;
}
