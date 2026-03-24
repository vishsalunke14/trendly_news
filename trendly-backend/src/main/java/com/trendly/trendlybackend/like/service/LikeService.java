package com.trendly.trendlybackend.like.service;

import com.trendly.trendlybackend.like.dto.LikeToggleRequest;
import com.trendly.trendlybackend.like.dto.LikeToggleResponse;
import com.trendly.trendlybackend.like.dto.UserLikesResponse;
import com.trendly.trendlybackend.like.model.Like;
import com.trendly.trendlybackend.like.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;

    // toggle like/unlike
    public LikeToggleResponse toggleLike(LikeToggleRequest request) {
        var existing = likeRepository.findByUserIdAndArticleUrl(
                request.getUserId(), request.getArticleUrl()
        );

        boolean nowLiked;

        if (existing.isPresent()) {
            // already liked → unlike (delete)
            likeRepository.delete(existing.get());
            nowLiked = false;
        } else {
            // not liked → create new like
            Like like = Like.builder()
                    .userId(request.getUserId())
                    .articleUrl(request.getArticleUrl())
                    .createdAt(LocalDateTime.now())
                    .build();
            likeRepository.save(like);
            nowLiked = true;
        }

        long count = likeRepository.countByArticleUrl(request.getArticleUrl());

        return LikeToggleResponse.builder()
                .liked(nowLiked)
                .likeCount(count)
                .build();
    }

    // get all liked article URLs for user
    public UserLikesResponse getLikesForUser(Long userId) {
        var likes = likeRepository.findByUserId(userId);

        var urls = likes.stream()
                .map(Like::getArticleUrl)
                .collect(Collectors.toList());

        return UserLikesResponse.builder()
                .userId(userId)
                .articleUrls(urls)
                .build();
    }
}
