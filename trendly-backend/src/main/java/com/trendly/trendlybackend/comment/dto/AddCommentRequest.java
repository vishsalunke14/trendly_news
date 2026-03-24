package com.trendly.trendlybackend.comment.dto;

import lombok.Data;

@Data
public class AddCommentRequest {
    private Long userId;
    private String userName;
    private String articleUrl;
    private String content;
}
