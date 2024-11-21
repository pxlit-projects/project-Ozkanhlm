package be.pxl.services.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "post")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    // Check op NOT NULL....

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String titel;

    private String picture;

    private String content;

    private String author;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Transient
    private List<Comment> comments;

    @Transient
    private Review review;

}
