package com.trendly.trendlybackend.like.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserLikesResponse {
    private Long userId;
    private List<String> articleUrls;
}
