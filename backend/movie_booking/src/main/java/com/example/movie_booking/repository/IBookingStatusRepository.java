package com.example.movie_booking.repository;

import com.example.movie_booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IBookingStatusRepository extends JpaRepository<BookingStatus,Long> {
}
