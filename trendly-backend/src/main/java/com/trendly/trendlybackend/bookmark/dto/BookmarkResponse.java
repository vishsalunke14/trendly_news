package com.trendly.trendlybackend.bookmark.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookmarkResponse {
    private Long id;
    private Long userId;
    private String articleUrl;
    private String title;
    private String sourceName;
    private String imageUrl;
    private LocalDateTime createdAt;
}
