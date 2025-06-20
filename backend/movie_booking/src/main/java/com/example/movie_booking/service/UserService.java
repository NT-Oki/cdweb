package com.example.movie_booking.service;

import com.example.movie_booking.dto.AdminRegisterDto;
import com.example.movie_booking.dto.RegisterDto;
import com.example.movie_booking.model.PendingUser;
import com.example.movie_booking.model.Role;
import com.example.movie_booking.model.User;
import com.example.movie_booking.repository.PendingUserRepository;
import com.example.movie_booking.repository.IRoleRepository;
import com.example.movie_booking.repository.IUserRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Locale;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private PendingUserRepository pendingUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MessageSource messageSource;

    public PendingUser savePendingUser(RegisterDto dto, Locale locale) {
        // Kiểm tra email tồn tại
        if (userRepository.findByEmail(dto.getEmail().trim().toLowerCase()) != null ||
                pendingUserRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException(messageSource.getMessage("user.email.exists", null, locale));
        }

        // Kiểm tra độ dài mật khẩu
        if (dto.getPassword().length() < 8) {
            throw new IllegalArgumentException(messageSource.getMessage("user.password.short", null, locale));
        }

        String verificationCode = RandomStringUtils.randomAlphanumeric(32);
        PendingUser pendingUser = PendingUser.builder()
                .email(dto.getEmail().trim().toLowerCase())
                .name(dto.getName())
                .password(passwordEncoder.encode(dto.getPassword()))
                .cardId(dto.getCardId())
                .phoneNumber(dto.getPhoneNumber())
                .gender(dto.isGender())
                .address(dto.getAddress())
                .avatar(dto.getAvatar())
                .verificationCode(verificationCode)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(24)) // Hết hạn sau 24 giờ
                .build();

        return pendingUserRepository.save(pendingUser);
    }

    public User verifyAndSaveUser(String verificationCode, Locale locale) {
        PendingUser pendingUser = pendingUserRepository.findByVerificationCode(verificationCode)
                .orElseThrow(() -> new IllegalArgumentException(
                        messageSource.getMessage("auth.verify.invalid", null, locale)));

        if (pendingUser.getExpiresAt().isBefore(LocalDateTime.now())) {
            pendingUserRepository.delete(pendingUser);
            throw new IllegalArgumentException(messageSource.getMessage("auth.verify.expired", null, locale));
        }

        if (pendingUser.getPassword() == null) {
            // Đây là mã dùng cho quên mật khẩu, không phải đăng ký
            throw new IllegalArgumentException(messageSource.getMessage("auth.verify.notforregister", null, locale));
        }

        Role role = roleRepository.findByName("ROLE_USER");
        if (role == null) {
            role = new Role();
            role.setName("ROLE_USER");
            roleRepository.save(role);
        }

        User user = User.builder()
                .email(pendingUser.getEmail())
                .password(pendingUser.getPassword())
                .name(pendingUser.getName())
                .cardId(pendingUser.getCardId())
                .phoneNumber(pendingUser.getPhoneNumber())
                .gender(pendingUser.getGender())
                .address(pendingUser.getAddress())
                .avatar(pendingUser.getAvatar())
                .status(true)
                .code(RandomStringUtils.randomAlphanumeric(5))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        pendingUserRepository.delete(pendingUser);
        return savedUser;
    }

    public String requestPasswordReset(String email, Locale locale) {
        User user = userRepository.findByEmail(email.trim().toLowerCase());
        if (user == null) {
            throw new IllegalArgumentException(messageSource.getMessage("auth.forgot.notfound", null, locale));
        }
        if (!user.isStatus()) {
            throw new IllegalArgumentException(messageSource.getMessage("auth.forgot.locked", null, locale));
        }

        pendingUserRepository.findByEmail(email).ifPresent(pendingUser -> {
            if (pendingUser.getPassword() != null) {
                throw new IllegalArgumentException(messageSource.getMessage("auth.forgot.pending", null, locale));
            }
            pendingUserRepository.delete(pendingUser);
        });

        String resetCode = RandomStringUtils.randomAlphanumeric(32);
        PendingUser pendingUser = PendingUser.builder()
                .email(email.trim().toLowerCase())
                .name(user.getName())
                .verificationCode(resetCode)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();

        pendingUserRepository.save(pendingUser);
        return resetCode; // Trả về resetCode để gửi email
    }

    public User resetPassword(String resetCode, String newPassword, Locale locale) {
        PendingUser pendingUser = pendingUserRepository.findByVerificationCode(resetCode)
                .orElseThrow(() -> new IllegalArgumentException(
                        messageSource.getMessage("auth.reset.code.invalid", null, locale)));

        if (pendingUser.getExpiresAt().isBefore(LocalDateTime.now())) {
            pendingUserRepository.delete(pendingUser);
            throw new IllegalArgumentException(messageSource.getMessage("auth.reset.code.expired", null, locale));
        }

        if (pendingUser.getPassword() != null) {
            // Đây là mã dùng cho đăng ký, không phải reset
            throw new IllegalArgumentException(messageSource.getMessage("auth.reset.code.notforreset", null, locale));
        }

        User user = userRepository.findByEmail(pendingUser.getEmail());
        if (user == null) {
            pendingUserRepository.delete(pendingUser);
            throw new IllegalArgumentException(messageSource.getMessage("user.notfound", null, locale));
        }

        if (newPassword.length() < 8) {
            throw new IllegalArgumentException(messageSource.getMessage("auth.reset.password.short", null, locale));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        User savedUser = userRepository.save(user);
        pendingUserRepository.delete(pendingUser);
        return savedUser;
    }

    public User convertToUser(AdminRegisterDto dto, Locale locale) {
        Role role = roleRepository.findByName(dto.getRole());
        if (role == null) {
            throw new IllegalArgumentException(messageSource.getMessage("user.role.invalid",
                    new Object[]{dto.getRole()}, locale));
        }

        return User.builder()
                .id(dto.getId())
                .email(dto.getEmail().trim().toLowerCase())
                .name(dto.getName())
                .cardId(dto.getCardId())
                .phoneNumber(dto.getPhoneNumber())
                .gender(dto.isGender())
                .address(dto.getAddress())
                .avatar(dto.getAvatar())
                .role(role)
                .build();
    }

    public User save(AdminRegisterDto dto, Locale locale) {
        User existingUser = null;
        if (dto.getId() != null) {
            existingUser = userRepository.findById(dto.getId()).orElse(null);
            if (existingUser == null) {
                throw new IllegalArgumentException(messageSource.getMessage("user.id.notfound",
                        new Object[]{dto.getId()}, locale));
            }
        }

        User user = convertToUser(dto, locale);

        if (dto.getId() == null) {
            user.setStatus(true);
            user.setCode(RandomStringUtils.randomAlphanumeric(5));
        } else {
            user.setStatus(existingUser.isStatus());
            user.setCode(existingUser.getCode());
        }

        if (dto.getId() == null) {
            if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
                throw new IllegalArgumentException(messageSource.getMessage("user.password.empty", null, locale));
            }
            if (dto.getPassword().length() < 8) {
                throw new IllegalArgumentException(messageSource.getMessage("user.password.short", null, locale));
            }
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        } else {
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            } else {
                user.setPassword(existingUser.getPassword());
            }
        }

        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findAllMembers() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }
}