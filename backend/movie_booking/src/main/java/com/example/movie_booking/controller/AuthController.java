package com.example.movie_booking.controller;

import com.example.movie_booking.service.UserService;
import jakarta.validation.Valid;
import com.example.movie_booking.config.JwtTokenUtil;
import com.example.movie_booking.dto.request.LoginDto;
import com.example.movie_booking.model.User;
import com.example.movie_booking.security.TokenBlacklist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private TokenBlacklist tokenBlacklist;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginDto) {
        User user = userService.findByEmail(loginDto.getEmail());

        if (user == null || !passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "Email hoặc mật khẩu không đúng");
            return ResponseEntity.badRequest().body(errors);
        }

        String token = jwtTokenUtil.generateToken(user.getEmail(), user.getRole().getName());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đăng nhập thành công");
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("avatar", user.getAvatar());
        response.put("role", user.getRole().getName());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/login")
    public ResponseEntity<?> getLoginPage() {
        return ResponseEntity.ok(Map.of("message", "Vui lòng đăng nhập bằng POST /login"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token không hợp lệ"));
        }

        String token = authHeader.substring(7).trim(); // Bỏ 'Bearer ' và xóa khoảng trắng
        try {
            if (!jwtTokenUtil.validateToken(token)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Token không hợp lệ hoặc đã hết hạn"));
            }

            long expirationTime = jwtTokenUtil.getExpirationDateFromToken(token).getTime();
            tokenBlacklist.blacklistToken(token, expirationTime);
            return ResponseEntity.ok(Map.of("message", "Đăng xuất thành công. Token đã bị vô hiệu hóa."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Lỗi khi xử lý token: " + e.getMessage()));
        }
    }
}
