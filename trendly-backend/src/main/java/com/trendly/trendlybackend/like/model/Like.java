package com.trendly.trendlybackend.like.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "article_likes",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "article_url"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "article_url", nullable = false, length = 1000)
    private String articleUrl;

    private LocalDateTime createdAt;
}
