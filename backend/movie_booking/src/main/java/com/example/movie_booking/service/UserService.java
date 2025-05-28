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
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .cardId(dto.getCardId())
                .phoneNumber(dto.getPhoneNumber())
                .gender(dto.isGender())
                .address(dto.getAddress())
                .avatar(dto.getAvatar())
                .status(true) // Mặc định active
                .code(RandomStringUtils.randomAlphanumeric(5))
                .role(role) // Gán role mặc định
                .build();
    }

    public User convertToUser(AdminRegisterDto dto) {
        String roleName = dto.getRole();
        Role role = roleRepository.findByName(roleName);
        if (role == null) {
            role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
        }
        return User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .cardId(dto.getCardId())
                .phoneNumber(dto.getPhoneNumber())
                .gender(dto.isGender())
                .address(dto.getAddress())
                .avatar(dto.getAvatar())
                .status(true) // Mặc định active
                .code(RandomStringUtils.randomAlphanumeric(5))
                .role(role) // Gán role mặc định
                .build();
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public void save(User user) {
        userRepository.save(user);
    }
    public List<User> findAllMembers() {
        return userRepository.findAll();
    }
    public User findById(Long id) {
        return userRepository.findById(id).get();
    }
    public void delete(User user) {
        userRepository.delete(user);
    }
}
