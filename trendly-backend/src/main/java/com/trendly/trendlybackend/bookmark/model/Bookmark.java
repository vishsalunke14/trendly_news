package com.trendly.trendlybackend.bookmark.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "bookmarks",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "article_url"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which user saved this article
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // URL of the news article
    @Column(name = "article_url", nullable = false, length = 1000)
    private String articleUrl;

    // Optional: store title for quicker display
    @Column(name = "title", length = 500)
    private String title;

    // Source like "BBC News", "NDTV"
    @Column(name = "source_name")
    private String sourceName;

    // Optional image URL
    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    private LocalDateTime createdAt;
}
