package com.example.movie_booking.repository;

import com.example.movie_booking.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISeatRepository extends JpaRepository<Seat, Long> {
}
