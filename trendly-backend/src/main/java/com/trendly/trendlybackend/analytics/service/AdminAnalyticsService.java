package com.trendly.trendlybackend.analytics.service;

import com.trendly.trendlybackend.analytics.dto.AdminAnalyticsResponse;
import com.trendly.trendlybackend.analytics.dto.TopArticleStats;
import com.trendly.trendlybackend.bookmark.repository.BookmarkRepository;
import com.trendly.trendlybackend.comment.repository.CommentRepository;
import com.trendly.trendlybackend.like.repository.LikeRepository;
import com.trendly.trendlybackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final UserRepository userRepository;
    private final BookmarkRepository bookmarkRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public AdminAnalyticsResponse getSummary() {

        long totalUsers = userRepository.count();
        long totalAdmins = userRepository.countByRole("ADMIN");
        long totalNormalUsers = userRepository.countByRole("USER");

        long totalBookmarks = bookmarkRepository.count();
        long totalLikes = likeRepository.count();
        long totalComments = commentRepository.count();

        // Top 5 liked
        List<TopArticleStats> topLiked = likeRepository.findTopArticlesByLikes()
                .stream()
                .limit(5)
                .map(row -> TopArticleStats.builder()
                        .articleUrl((String) row[0])
                        .count((Long) row[1])
                        .build())
                .collect(Collectors.toList());

        // Top 5 commented
        List<TopArticleStats> topCommented = commentRepository.findTopArticlesByComments()
                .stream()
                .limit(5)
                .map(row -> TopArticleStats.builder()
                        .articleUrl((String) row[0])
                        .count((Long) row[1])
                        .build())
                .collect(Collectors.toList());

        return AdminAnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalAdmins(totalAdmins)
                .totalNormalUsers(totalNormalUsers)
                .totalBookmarks(totalBookmarks)
                .totalLikes(totalLikes)
                .totalComments(totalComments)
                .topLikedArticles(topLiked)
                .topCommentedArticles(topCommented)
                .build();
    }
}
