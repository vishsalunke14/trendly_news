package com.trendly.trendlybackend.comment.service;

import com.trendly.trendlybackend.comment.dto.AddCommentRequest;
import com.trendly.trendlybackend.comment.dto.CommentResponse;
import com.trendly.trendlybackend.comment.model.Comment;
import com.trendly.trendlybackend.comment.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentResponse addComment(AddCommentRequest request) {
        Comment comment = Comment.builder()
                .userId(request.getUserId())
                .userName(request.getUserName())
                .articleUrl(request.getArticleUrl())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        Comment saved = commentRepository.save(comment);
        return toResponse(saved);
    }

    public List<CommentResponse> getCommentsForArticle(String articleUrl) {
        return commentRepository.findByArticleUrlOrderByCreatedAtDesc(articleUrl)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ✅ Admin: get all comments (for moderation)
    public List<CommentResponse> getAllComments() {
        return commentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<CommentResponse> getCommentsByUser(Long userId) {
    return commentRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .map(this::toResponse)
            .toList();
}


    // User or admin delete
    public void deleteComment(Long commentId, Long currentUserId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!isAdmin && !comment.getUserId().equals(currentUserId)) {
            throw new RuntimeException("You cannot delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment c) {
        return CommentResponse.builder()
                .id(c.getId())
                .userId(c.getUserId())
                .userName(c.getUserName())
                .articleUrl(c.getArticleUrl())
                .content(c.getContent())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
