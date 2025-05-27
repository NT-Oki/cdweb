package com.example.movie_booking.service;

import com.example.movie_booking.dto.AdminRegisterDto;
import com.example.movie_booking.dto.RegisterDto;
import com.example.movie_booking.model.User;

import java.util.List;

public interface IUserService {
    public User convertToUser(RegisterDto dto, String roleName);

    public User convertToUser(AdminRegisterDto dto);

    public User findByEmail(String email);

    public void save(User user);

    public List<User> findAllMembers();

    public User findById(Long id);

    public void delete(User user);
}
