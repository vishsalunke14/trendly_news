package com.trendly.trendlybackend.comment.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user who wrote the comment
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // snapshot of user name for display (so we don't need join every time)
    @Column(name = "user_name", nullable = false)
    private String userName;

    // which article this comment belongs to
    @Column(name = "article_url", nullable = false, length = 1000)
    private String articleUrl;

    @Column(name = "content", nullable = false, length = 2000)
    private String content;

    private LocalDateTime createdAt;
}
