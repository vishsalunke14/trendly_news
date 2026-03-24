package com.trendly.trendlybackend.analytics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopArticleStats {
    private String articleUrl;
    private long count;
}
