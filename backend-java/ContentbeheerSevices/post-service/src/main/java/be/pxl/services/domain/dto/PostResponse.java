package be.pxl.services.domain.dto;

import be.pxl.services.domain.Category;
import be.pxl.services.domain.Status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private String titel;
    private String picture;
    private String content;
    private String author;
    private Status status;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private Category category;
}
