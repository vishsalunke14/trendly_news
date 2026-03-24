package com.trendly.trendlybackend.user.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    // If later you want to allow email change, add: private String email;
}
