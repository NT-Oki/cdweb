package com.example.movie_booking.repository;

import com.example.movie_booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IBookingRepository extends JpaRepository<Booking,Long> {
}
