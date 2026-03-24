package com.trendly.trendlybackend.like.dto;

import lombok.Data;

@Data
public class LikeToggleRequest {
    private Long userId;
    private String articleUrl;
}
