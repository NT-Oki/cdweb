package com.example.movie_booking.repository;

import com.example.movie_booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBookingRepository extends JpaRepository<Booking,Long> {
    Booking findByPaymentId(String paymentId);
    List<Booking> findByCodeBookingIsNotNull();


}
