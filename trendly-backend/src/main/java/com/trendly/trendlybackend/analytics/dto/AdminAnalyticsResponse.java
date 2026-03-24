package com.trendly.trendlybackend.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminAnalyticsResponse {

    private long totalUsers;
    private long totalAdmins;
    private long totalNormalUsers;

    private long totalBookmarks;
    private long totalLikes;
    private long totalComments;

    private List<TopArticleStats> topLikedArticles;
    private List<TopArticleStats> topCommentedArticles;
}
