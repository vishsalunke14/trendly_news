package com.trendly.trendlybackend.bookmark.controller;

import com.trendly.trendlybackend.bookmark.dto.AddBookmarkRequest;
import com.trendly.trendlybackend.bookmark.dto.BookmarkResponse;
import com.trendly.trendlybackend.bookmark.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks") //  matches frontend path
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:5173") //  allow React app
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @PostMapping
    public ResponseEntity<BookmarkResponse> add(@RequestBody AddBookmarkRequest request) {
        BookmarkResponse response = bookmarkService.addBookmark(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookmarkResponse>> getUserBookmarks(@PathVariable Long userId) {
        List<BookmarkResponse> list = bookmarkService.getBookmarksForUser(userId);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{bookmarkId}")
    public ResponseEntity<Void> deleteBookmark(
            @PathVariable Long bookmarkId,
            @RequestParam Long userId
    ) {
        bookmarkService.deleteBookmark(bookmarkId, userId);
        return ResponseEntity.noContent().build();
    }
}
