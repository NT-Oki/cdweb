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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public PendingUser savePendingUser(RegisterDto dto) {
        // Kiểm tra email tồn tại
        if (userRepository.findByEmail(dto.getEmail().trim().toLowerCase()) != null ||
                pendingUserRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        // Kiểm tra độ dài mật khẩu
        if (dto.getPassword().length() < 8) {
            throw new IllegalArgumentException("Mật khẩu phải từ 8 ký tự trở lên");
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

    public User verifyAndSaveUser(String verificationCode) {
        PendingUser pendingUser = pendingUserRepository.findByVerificationCode(verificationCode)
                .orElseThrow(() -> new IllegalArgumentException("Mã xác minh không hợp lệ"));

        if (pendingUser.getExpiresAt().isBefore(LocalDateTime.now())) {
            pendingUserRepository.delete(pendingUser);
            throw new IllegalArgumentException("Mã xác minh đã hết hạn");
        }

        if (pendingUser.getPassword() == null) {
            // Đây là mã dùng cho quên mật khẩu, không phải đăng ký
            throw new IllegalArgumentException("Mã này không dùng để xác minh đăng ký");
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

    public String requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase());
        if (user == null) {
            throw new IllegalArgumentException("Email không tồn tại");
        }
        if (!user.isStatus()) {
            throw new IllegalArgumentException("Tài khoản đã bị khóa");
        }

        pendingUserRepository.findByEmail(email).ifPresent(pendingUser -> {
            if (pendingUser.getPassword() != null) {
                throw new IllegalArgumentException("Email đang chờ xác minh đăng ký");
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

    public User resetPassword(String resetCode, String newPassword) {
        PendingUser pendingUser = pendingUserRepository.findByVerificationCode(resetCode)
                .orElseThrow(() -> new IllegalArgumentException("Mã đặt lại mật khẩu không hợp lệ"));

        if (pendingUser.getExpiresAt().isBefore(LocalDateTime.now())) {
            pendingUserRepository.delete(pendingUser);
            throw new IllegalArgumentException("Mã đặt lại mật khẩu đã hết hạn");
        }

        if (pendingUser.getPassword() != null) {
            // Đây là mã dùng cho đăng ký, không phải reset
            throw new IllegalArgumentException("Mã này không dùng để đặt lại mật khẩu");
        }

        User user = userRepository.findByEmail(pendingUser.getEmail());
        if (user == null) {
            pendingUserRepository.delete(pendingUser);
            throw new IllegalArgumentException("Người dùng không tồn tại");
        }

        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("Mật khẩu mới phải từ 8 ký tự trở lên");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        User savedUser = userRepository.save(user);
        pendingUserRepository.delete(pendingUser);
        return savedUser;
    }

    public User convertToUser(AdminRegisterDto dto) {
        Role role = roleRepository.findByName(dto.getRole());
        if (role == null) {
            throw new IllegalArgumentException("Role không tồn tại: " + dto.getRole());
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

    public User save(AdminRegisterDto dto) {
        User existingUser = null;
        if (dto.getId() != null) {
            existingUser = userRepository.findById(dto.getId()).orElse(null);
            if (existingUser == null) {
                throw new IllegalArgumentException("Không tìm thấy người dùng với ID: " + dto.getId());
            }
        }

        User user = convertToUser(dto);

        if (dto.getId() == null) {
            user.setStatus(true);
            user.setCode(RandomStringUtils.randomAlphanumeric(5));
        } else {
            user.setStatus(existingUser.isStatus());
            user.setCode(existingUser.getCode());
        }

        if (dto.getId() == null) {
            if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
                throw new IllegalArgumentException("Mật khẩu không được để trống khi thêm mới");
            }
            if (dto.getPassword().length() < 8) {
                throw new IllegalArgumentException("Mật khẩu phải từ 8 ký tự trở lên");
            }
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        } else {
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            } else {
                user.setPassword(existingUser.getPassword());
            }
        }

        return userRepository.save(user); // Không gửi email
    }

    public User save(User user) {
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