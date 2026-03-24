package com.trendly.trendlybackend.comment.repository;

import com.trendly.trendlybackend.comment.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Get all comments for a given article, newest first
    List<Comment> findByArticleUrlOrderByCreatedAtDesc(String articleUrl);

    // Get all comments for a specific user (useful for profile / admin)
    List<Comment> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT c.articleUrl, COUNT(c) AS commentCount " +
           "FROM Comment c GROUP BY c.articleUrl ORDER BY commentCount DESC")
    List<Object[]> findTopArticlesByComments(); 

    
}
