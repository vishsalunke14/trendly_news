package com.trendly.trendlybackend.comment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String articleUrl;
    private String content;
    private LocalDateTime createdAt;
}
