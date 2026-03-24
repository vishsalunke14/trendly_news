package com.trendly.trendlybackend.user.service;

import com.trendly.trendlybackend.user.dto.ChangePasswordRequest;
import com.trendly.trendlybackend.user.dto.UpdateProfileRequest;
import com.trendly.trendlybackend.user.dto.UserInfoResponse;
import com.trendly.trendlybackend.user.model.User;
import com.trendly.trendlybackend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;

    public UserInfoResponse getUserInfo(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return toResponse(user);
    }

    public UserInfoResponse updateProfile(Long id, UpdateProfileRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        // if you later allow email change, update here too.

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public void changePassword(Long id, ChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // NOTE:
        // If you use BCrypt, change this to passwordEncoder.matches(...)
        if (!user.getPassword().equals(request.getCurrentPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(request.getNewPassword());
        userRepository.save(user);
    }

    private UserInfoResponse toResponse(User user) {
        return UserInfoResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
