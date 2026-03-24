package com.trendly.trendlybackend.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    // For now: plain text password (we’ll hash later)
    @Column(nullable = false)
    private String password;

    // "USER" or "ADMIN"
    @Column(nullable = false)
    private String role;

    private LocalDateTime createdAt;
}
