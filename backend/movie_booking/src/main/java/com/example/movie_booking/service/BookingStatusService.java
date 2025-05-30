package com.example.movie_booking.service;

import com.example.movie_booking.model.BookingStatus;
import com.example.movie_booking.repository.IBookingStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookingStatusService {
    @Autowired
    IBookingStatusRepository bookingStatusRepository;
    public BookingStatus getBookingStatus(long bookingId) {
        return bookingStatusRepository.getReferenceById(bookingId);
    }

}
