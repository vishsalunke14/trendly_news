package com.trendly.trendlybackend.user.controller;

import com.trendly.trendlybackend.user.dto.UserLoginRequest;
import com.trendly.trendlybackend.user.dto.UserRegisterRequest;
import com.trendly.trendlybackend.user.dto.UserResponse;
import com.trendly.trendlybackend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // allow your React app
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody UserRegisterRequest request) {
        UserResponse response = userService.register(request, false);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register-admin")
    public ResponseEntity<UserResponse> registerAdmin(@RequestBody UserRegisterRequest request) {
        UserResponse response = userService.register(request, true);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserLoginRequest request) {
        UserResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/admin-login")
public ResponseEntity<UserResponse> adminLogin(@RequestBody UserLoginRequest request) {
    UserResponse user = userService.login(request);

    if (!"ADMIN".equals(user.getRole())) {
        throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.FORBIDDEN,
                "Not an admin"
        );
    }

    return ResponseEntity.ok(user);
}

}
