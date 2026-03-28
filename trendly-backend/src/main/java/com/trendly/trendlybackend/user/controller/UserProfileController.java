package com.trendly.trendlybackend.user.controller;

import com.trendly.trendlybackend.user.dto.ChangePasswordRequest;
import com.trendly.trendlybackend.user.dto.UpdateProfileRequest;
import com.trendly.trendlybackend.user.dto.UserInfoResponse;
import com.trendly.trendlybackend.user.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController {

    private final UserProfileService userProfileService;

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserInfoResponse> getUser(@PathVariable Long id) {
        UserInfoResponse response = userProfileService.getUserInfo(id);
        return ResponseEntity.ok(response);
    }

    // PUT /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<UserInfoResponse> updateProfile(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request
    ) {
        UserInfoResponse response = userProfileService.updateProfile(id, request);
        return ResponseEntity.ok(response);
    }

    // PUT /api/users/{id}/password
    @PutMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request
    ) {
        userProfileService.changePassword(id, request);
        return ResponseEntity.noContent().build();
    }
}
