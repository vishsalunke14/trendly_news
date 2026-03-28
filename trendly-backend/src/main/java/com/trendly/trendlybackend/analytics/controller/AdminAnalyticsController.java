package com.trendly.trendlybackend.analytics.controller;

import com.trendly.trendlybackend.analytics.dto.AdminAnalyticsResponse;
import com.trendly.trendlybackend.analytics.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
// @CrossOrigin(origins = "http://localhost:5173")
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;

    // GET /api/admin/analytics/summary
    @GetMapping("/summary")
    public ResponseEntity<AdminAnalyticsResponse> getSummary() {
        AdminAnalyticsResponse response = adminAnalyticsService.getSummary();
        return ResponseEntity.ok(response);
    }
}
