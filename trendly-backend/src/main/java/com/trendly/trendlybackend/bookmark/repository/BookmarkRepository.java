package com.trendly.trendlybackend.bookmark.repository;

import com.trendly.trendlybackend.bookmark.model.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    // Get all bookmarks for one user
    List<Bookmark> findByUserId(Long userId);

    // Check if this user already bookmarked this article
    Optional<Bookmark> findByUserIdAndArticleUrl(Long userId, String articleUrl);
}
