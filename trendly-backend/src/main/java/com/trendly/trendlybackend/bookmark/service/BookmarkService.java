package com.trendly.trendlybackend.bookmark.service;

import com.trendly.trendlybackend.bookmark.dto.AddBookmarkRequest;
import com.trendly.trendlybackend.bookmark.dto.BookmarkResponse;
import com.trendly.trendlybackend.bookmark.model.Bookmark;
import com.trendly.trendlybackend.bookmark.repository.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    public BookmarkResponse addBookmark(AddBookmarkRequest request) {

        // If already bookmarked, just return existing instead of error
        var existing = bookmarkRepository.findByUserIdAndArticleUrl(
                request.getUserId(), request.getArticleUrl()
        );

        if (existing.isPresent()) {
            return toResponse(existing.get());
        }

        Bookmark bookmark = Bookmark.builder()
                .userId(request.getUserId())
                .articleUrl(request.getArticleUrl())
                .title(request.getTitle())
                .sourceName(request.getSourceName())
                .imageUrl(request.getImageUrl())
                .createdAt(LocalDateTime.now())
                .build();

        Bookmark saved = bookmarkRepository.save(bookmark);
        return toResponse(saved);
    }

    public List<BookmarkResponse> getBookmarksForUser(Long userId) {
        return bookmarkRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteBookmark(Long bookmarkId, Long userId) {
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new RuntimeException("Bookmark not found"));

        if (!bookmark.getUserId().equals(userId)) {
            throw new RuntimeException("You cannot delete this bookmark");
        }

        bookmarkRepository.delete(bookmark);
    }

    private BookmarkResponse toResponse(Bookmark b) {
        return BookmarkResponse.builder()
                .id(b.getId())
                .userId(b.getUserId())
                .articleUrl(b.getArticleUrl())
                .title(b.getTitle())
                .sourceName(b.getSourceName())
                .imageUrl(b.getImageUrl())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
