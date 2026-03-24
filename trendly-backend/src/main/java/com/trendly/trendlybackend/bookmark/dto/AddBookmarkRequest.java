package com.trendly.trendlybackend.bookmark.dto;

import lombok.Data;

@Data
public class AddBookmarkRequest {
    private Long userId;
    private String articleUrl;
    private String title;
    private String sourceName;
    private String imageUrl;
}
