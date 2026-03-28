package com.trendly.trendlybackend.comment.controller;

import com.trendly.trendlybackend.comment.dto.CommentResponse;
import com.trendly.trendlybackend.comment.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/comments")  // 👈 base path ONLY for admin
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:5173")
public class AdminCommentController {

    private final CommentService commentService;

    // GET /api/admin/comments
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getAllComments() {
        List<CommentResponse> list = commentService.getAllComments();
        return ResponseEntity.ok(list);
    }

    // DELETE /api/admin/comments/{id}?adminId=...
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteCommentAsAdmin(
            @PathVariable Long commentId,
            @RequestParam Long adminId
    ) {
        // For now: we trust caller is admin (later you can check role)
        commentService.deleteComment(commentId, adminId, true);
        return ResponseEntity.noContent().build();
    }
}
