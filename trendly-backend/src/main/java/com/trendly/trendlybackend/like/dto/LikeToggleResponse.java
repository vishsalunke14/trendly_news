package com.trendly.trendlybackend.like.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LikeToggleResponse {
    private boolean liked;   // true = now liked, false = now unliked
    private long likeCount;  // total likes for this article
}
