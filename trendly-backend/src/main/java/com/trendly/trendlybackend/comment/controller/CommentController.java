package com.trendly.trendlybackend.comment.controller;

import com.trendly.trendlybackend.comment.dto.AddCommentRequest;
import com.trendly.trendlybackend.comment.dto.CommentResponse;
import com.trendly.trendlybackend.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    private final CommentService commentService;

    // ➜ POST /api/comments
    @PostMapping("/api/comments")
    public ResponseEntity<CommentResponse> addComment(@RequestBody AddCommentRequest request) {
        CommentResponse response = commentService.addComment(request);
        return ResponseEntity.ok(response);
    }

    // ➜ GET /api/comments?articleUrl=...
    @GetMapping("/api/comments")
    public ResponseEntity<List<CommentResponse>> getCommentsForArticle(
            @RequestParam String articleUrl
    ) {
        List<CommentResponse> list = commentService.getCommentsForArticle(articleUrl);
        return ResponseEntity.ok(list);
    }

    // ➜ DELETE /api/comments/{id}?userId=...
    @DeleteMapping("/api/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestParam Long userId
    ) {
        commentService.deleteComment(commentId, userId, false);
        return ResponseEntity.noContent().build();
    }

    // ➜ GET /api/comments/user/{userId}
@GetMapping("/api/comments/user/{userId}")
public ResponseEntity<List<CommentResponse>> getCommentsByUser(
        @PathVariable Long userId
) {
    List<CommentResponse> list = commentService.getCommentsByUser(userId);
    return ResponseEntity.ok(list);
}

}
