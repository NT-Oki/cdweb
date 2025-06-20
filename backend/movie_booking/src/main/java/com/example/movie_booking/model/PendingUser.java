package com.example.movie_booking.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String name;

    private String password; // Lưu mật khẩu đã mã hóa

    private String cardId;
    private String phoneNumber;
    private Boolean gender;
    private String address;
    private String avatar;

    @Column(nullable = false, unique = true)
    private String verificationCode; // Mã xác minh

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt; // Thời gian hết hạn
}