package com.example.movie_booking.service;

import org.apache.commons.lang3.RandomStringUtils;
import com.example.movie_booking.dto.AdminRegisterDto;
import com.example.movie_booking.dto.RegisterDto;
import com.example.movie_booking.model.Role;
import com.example.movie_booking.model.User;
import com.example.movie_booking.repository.IRoleRepository;
import com.example.movie_booking.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User convertToUser(RegisterDto dto, String roleName) {
        Role role = roleRepository.findByName(roleName);
        if (role == null) {
            role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
        }
        return User.builder()
                .email(dto.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .cardId(dto.getCardId())
                .phoneNumber(dto.getPhoneNumber())
                .gender(dto.isGender())
                .address(dto.getAddress())
                .avatar(dto.getAvatar())
                .status(true)
                .code(RandomStringUtils.randomAlphanumeric(5))
                .role(role)
                .build();
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
        // Lấy user hiện có nếu là cập nhật
        User existingUser = null;
        if (dto.getId() != null) {
            existingUser = userRepository.findById(dto.getId()).orElse(null);
            if (existingUser == null) {
                throw new IllegalArgumentException("Không tìm thấy người dùng với ID: " + dto.getId());
            }
        }

        User user = convertToUser(dto);

        // Gán trạng thái và code khi thêm mới
        if (dto.getId() == null) {
            user.setStatus(true);
            user.setCode(RandomStringUtils.randomAlphanumeric(5));
        } else {
            // Giữ trạng thái và code cũ khi cập nhật
            user.setStatus(existingUser.isStatus());
            user.setCode(existingUser.getCode());
        }

        // Xử lý mật khẩu
        if (dto.getId() == null) {
            // Thêm mới: Yêu cầu mật khẩu
            if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
                throw new IllegalArgumentException("Mật khẩu không được để trống khi thêm mới");
            }
            if (dto.getPassword().length() < 8) {
                throw new IllegalArgumentException("Mật khẩu phải từ 8 ký tự trở lên");
            }
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        } else {
            // Cập nhật: Giữ mật khẩu cũ nếu không cung cấp
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            } else {
                user.setPassword(existingUser.getPassword());
            }
        }

        return userRepository.save(user);
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