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
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.Locale;
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
    private MessageSource messageSource;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginDto, Locale locale) {
        User user = userService.findByEmail(loginDto.getEmail());

        if (user == null || !passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            Map<String, String> errors = new HashMap<>();
            errors.put("message", messageSource.getMessage("auth.login.failed", null, locale));
            return ResponseEntity.badRequest().body(errors);
        }

        String token = jwtTokenUtil.generateToken(user.getEmail(), user.getRole().getName());

        Map<String, Object> response = new HashMap<>();
        response.put("message", messageSource.getMessage("auth.login.success", null, locale));
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("avatar", user.getAvatar());
        response.put("role", user.getRole().getName());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/login")
    public ResponseEntity<?> getLoginPage(Locale locale) {
        return ResponseEntity.ok(Map.of("message",
                messageSource.getMessage("auth.login.page", null, locale)));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto form, BindingResult result, Locale locale) {
        Map<String, String> errors = new HashMap<>();

        // Kiểm tra xác nhận mật khẩu
        if (!form.getPassword().equals(form.getConfirmPassword())) {
            errors.put("confirmPassword", messageSource.getMessage("user.password.mismatch", null, locale));
        }

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            result.getFieldErrors().forEach(err ->
                    errors.put(err.getField(), messageSource.getMessage(err.getDefaultMessage(), null, locale))
            );
        }

        // Nếu có lỗi, trả về mã lỗi 400
        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            PendingUser pendingUser = userService.savePendingUser(form, locale);
            emailService.sendVerificationEmail(pendingUser.getEmail(), pendingUser.getName(), pendingUser.getVerificationCode());

            Map<String, String> successData = new HashMap<>();
            successData.put("message",
                    messageSource.getMessage("auth.register.success", null, locale));
            successData.put("email", form.getEmail());
            return ResponseEntity.status(HttpStatus.OK).body(successData);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    messageSource.getMessage(e.getMessage(), null, locale)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            messageSource.getMessage("auth.register.failed", new Object[]{e.getMessage()}, locale)));
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String code, Locale locale) {
        try {
            User user = userService.verifyAndSaveUser(code, locale);
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
            return ResponseEntity.ok(Map.of("message",
                    messageSource.getMessage("auth.verify.success", null, locale)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    messageSource.getMessage(e.getMessage(), null, locale)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            messageSource.getMessage("auth.verify.failed", new Object[]{e.getMessage()}, locale)));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request, Locale locale) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error",
                        messageSource.getMessage("auth.forgot.empty", null, locale)));
            }
            User user = userService.findByEmail(email.trim().toLowerCase());
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error",
                        messageSource.getMessage("auth.forgot.notfound", null, locale)));
            }
            String resetCode = userService.requestPasswordReset(email, locale);
            emailService.sendPasswordResetEmail(email, user.getName(), resetCode);
            return ResponseEntity.ok(Map.of("message",
                    messageSource.getMessage("auth.forgot.success", null, locale)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    messageSource.getMessage(e.getMessage(), null, locale)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            messageSource.getMessage("auth.forgot.failed", new Object[]{e.getMessage()}, locale)));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request, Locale locale) {
        try {
            String resetCode = request.get("resetCode");
            String newPassword = request.get("newPassword");
            String confirmPassword = request.get("confirmPassword");

            if (resetCode == null || resetCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error",
                        messageSource.getMessage("auth.reset.code.empty", null, "Mã đặt lại không được để trống", locale)));
            }
            if (newPassword == null || newPassword.length() < 8) {
                return ResponseEntity.badRequest().body(Map.of("error",
                        messageSource.getMessage("auth.reset.password.short", null, "Mật khẩu mới phải từ 8 ký tự", locale)));
            }
            if (!newPassword.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body(Map.of("error",
                        messageSource.getMessage("auth.reset.password.mismatch", null, "Mật khẩu xác nhận không khớp", locale)));
            }

            User user = userService.resetPassword(resetCode, newPassword, locale);
            return ResponseEntity.ok(Map.of("message",
                    messageSource.getMessage("auth.reset.success", null, "Đặt lại mật khẩu thành công", locale)));
        } catch (IllegalArgumentException e) {
            String errorMessage = messageSource.getMessage("auth.reset.code.invalid", new Object[]{e.getMessage()},
                    "Mã đặt lại không hợp lệ: " + e.getMessage(), locale);
            return ResponseEntity.badRequest().body(Map.of("error", errorMessage));
        } catch (Exception e) {
            String errorMessage = messageSource.getMessage("auth.reset.failed", new Object[]{e.getMessage()},
                    "Đặt lại mật khẩu thất bại: " + e.getMessage(), locale);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", errorMessage));
        }
    }
}
