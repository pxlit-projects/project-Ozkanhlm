package be.pxl.services.domain.dto;

import be.pxl.services.domain.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewMessage {
    private Long id;
    private ReviewStatus reviewStatus;
    private String reviewMessage;
    private Long postId;
}
