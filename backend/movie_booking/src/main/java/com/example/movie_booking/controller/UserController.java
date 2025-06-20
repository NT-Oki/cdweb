package com.example.movie_booking.controller;

import com.example.movie_booking.config.JwtTokenUtil;
import com.example.movie_booking.dto.RegisterDto;
import com.example.movie_booking.model.PendingUser;
import com.example.movie_booking.model.User;
import com.example.movie_booking.security.TokenBlacklist;
import com.example.movie_booking.service.EmailService;
import com.example.movie_booking.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.Locale;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private TokenBlacklist tokenBlacklist;

    @Autowired
    private MessageSource messageSource;

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader, Locale locale) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    messageSource.getMessage("auth.logout.invalid", null, locale)));
        }

        String token = authHeader.substring(7).trim(); // Bỏ 'Bearer ' và xóa khoảng trắng
        try {
            if (!jwtTokenUtil.validateToken(token)) {
                return ResponseEntity.badRequest().body(Map.of("message",
                        messageSource.getMessage("auth.logout.expired", null, locale)));
            }

            long expirationTime = jwtTokenUtil.getExpirationDateFromToken(token).getTime();
            tokenBlacklist.blacklistToken(token, expirationTime);
            return ResponseEntity.ok(Map.of("message",
                    messageSource.getMessage("auth.logout.success", null, locale)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message",
                    messageSource.getMessage("auth.logout.error", new Object[]{e.getMessage()}, locale)));
        }
    }

}