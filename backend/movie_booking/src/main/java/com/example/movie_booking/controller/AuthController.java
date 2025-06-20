package com.example.movie_booking.controller;

import com.example.movie_booking.dto.RegisterDto;
import com.example.movie_booking.model.PendingUser;
import com.example.movie_booking.service.EmailService;
import com.example.movie_booking.service.UserService;
import jakarta.validation.Valid;
import com.example.movie_booking.config.JwtTokenUtil;
import com.example.movie_booking.dto.request.LoginDto;
import com.example.movie_booking.model.User;
import com.example.movie_booking.security.TokenBlacklist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private TokenBlacklist tokenBlacklist;
    @Autowired
    private EmailService emailService;
    @Autowired
    private AuthenticationManager authenticationManager;

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

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto form, BindingResult result) {
        Map<String, String> errors = new HashMap<>();

        // Kiểm tra xác nhận mật khẩu
        if (!form.getPassword().equals(form.getConfirmPassword())) {
            errors.put("confirmPassword", "Mật khẩu không tương ứng. Thử lại.");
        }

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            result.getFieldErrors().forEach(err ->
                    errors.put(err.getField(), err.getDefaultMessage())
            );
        }

        // Nếu có lỗi, trả về mã lỗi 400
        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            PendingUser pendingUser = userService.savePendingUser(form);
            emailService.sendVerificationEmail(pendingUser.getEmail(), pendingUser.getName(), pendingUser.getVerificationCode());

            Map<String, String> successData = new HashMap<>();
            successData.put("message", "Vui lòng kiểm tra email để xác minh tài khoản");
            successData.put("email", form.getEmail());
            return ResponseEntity.status(HttpStatus.OK).body(successData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Đăng ký thất bại: " + e.getMessage()));
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String code) {
        try {
            User user = userService.verifyAndSaveUser(code);
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
            return ResponseEntity.ok(Map.of("message", "Xác minh email thành công. Bạn có thể đăng nhập ngay."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Xác minh thất bại: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email không được để trống"));
            }
            User user = userService.findByEmail(email.trim().toLowerCase());
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email không tồn tại"));
            }
            String resetCode = userService.requestPasswordReset(email);
            emailService.sendPasswordResetEmail(email, user.getName(), resetCode);
            return ResponseEntity.ok(Map.of("message", "Vui lòng kiểm tra email để đặt lại mật khẩu"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Yêu cầu đặt lại mật khẩu thất bại: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String resetCode = request.get("resetCode");
            String newPassword = request.get("newPassword");
            String confirmPassword = request.get("confirmPassword");

            if (resetCode == null || resetCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mã đặt lại mật khẩu không được để trống"));
            }
            if (newPassword == null || newPassword.length() < 8) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mật khẩu mới phải từ 8 ký tự trở lên"));
            }
            if (!newPassword.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mật khẩu xác nhận không khớp"));
            }

            User user = userService.resetPassword(resetCode, newPassword);
            return ResponseEntity.ok(Map.of("message", "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Đặt lại mật khẩu thất bại: " + e.getMessage()));
        }
    }
}
