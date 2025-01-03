package be.pxl.services.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
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

    private String title;

    private String picture;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    private String author;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private Status status;

//    @Transient
//    private List<Comment> comments;
    @ElementCollection
    private List<Long> commentIds;

//    @Transient
//    private List<Review> reviews;
    @ElementCollection
    private List<Long> reviewIds;

    @CreationTimestamp
    @Column(name = "created_date")
    private LocalDateTime createdDate;

}
