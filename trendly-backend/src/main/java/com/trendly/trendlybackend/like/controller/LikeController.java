package com.trendly.trendlybackend.like.controller;

import com.trendly.trendlybackend.like.dto.LikeToggleRequest;
import com.trendly.trendlybackend.like.dto.LikeToggleResponse;
import com.trendly.trendlybackend.like.dto.UserLikesResponse;
import com.trendly.trendlybackend.like.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes") // 👈 base path
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // 👈 allow your React app
public class LikeController {

    private final LikeService likeService;

    // POST /api/likes/toggle
    @PostMapping("/toggle")
    public ResponseEntity<LikeToggleResponse> toggle(@RequestBody LikeToggleRequest request) {
        LikeToggleResponse response = likeService.toggleLike(request);
        return ResponseEntity.ok(response);
    }

    // GET /api/likes/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserLikesResponse> getUserLikes(@PathVariable Long userId) {
        UserLikesResponse response = likeService.getLikesForUser(userId);
        return ResponseEntity.ok(response);
    }
}
