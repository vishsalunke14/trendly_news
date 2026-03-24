package com.trendly.trendlybackend.like.repository;

import com.trendly.trendlybackend.like.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserIdAndArticleUrl(Long userId, String articleUrl);

    long countByArticleUrl(String articleUrl);

    List<Like> findByUserId(Long userId);

    
    @Query("SELECT l.articleUrl, COUNT(l) AS likeCount " +
           "FROM Like l GROUP BY l.articleUrl ORDER BY likeCount DESC")
           
    List<Object[]> findTopArticlesByLikes();
}
