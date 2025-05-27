package com.example.movie_booking.controller;

import jakarta.validation.Valid;
import com.example.movie_booking.config.JwtTokenUtil;
import com.example.movie_booking.dto.request.LoginDto;
import com.example.movie_booking.model.User;
import com.example.movie_booking.security.TokenBlacklist;
import com.example.movie_booking.service.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {
    private final IUserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final TokenBlacklist tokenBlacklist;

    public AuthController(IUserService userService,
                          PasswordEncoder passwordEncoder,
                          JwtTokenUtil jwtTokenUtil, TokenBlacklist tokenBlacklist) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
        this.tokenBlacklist = tokenBlacklist;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginDto) {
        User user = userService.findByEmail(loginDto.getEmail());

        if (user == null || !passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "Email hoặc mật khẩu không đúng");
            return ResponseEntity.badRequest().body(errors);
        }

        // Giả sử User có field getRole() trả về "ROLE_ADMIN" hoặc "ROLE_USER"
        String token = jwtTokenUtil.generateToken(user.getEmail(), user.getRole().getName());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đăng nhập thành công");
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("fullName", user.getName());

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
