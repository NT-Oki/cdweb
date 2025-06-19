package com.example.movie_booking.controller;

import com.example.movie_booking.dto.RegisterDto;
import com.example.movie_booking.model.PendingUser;
import com.example.movie_booking.model.User;
import com.example.movie_booking.service.EmailService;
import com.example.movie_booking.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;


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
}