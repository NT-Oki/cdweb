package com.example.movie_booking.repository;

import com.example.movie_booking.model.BookingSeat;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

@Repository
public interface IBookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    @Modifying
    @Transactional
    void deleteByBookingId(Long bookingId);
}
