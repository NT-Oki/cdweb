package com.example.movie_booking.repository;

import com.example.movie_booking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
}
