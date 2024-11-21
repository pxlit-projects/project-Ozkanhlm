package be.pxl.services.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "post")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String titel;

    private String content;

    private String author;

    @Enumerated(EnumType.STRING)

    private Status status;

    private LocalDateTime created_at;

    private LocalDateTime updated_at;

    @Enumerated(EnumType.STRING)

    private Category category;
}
