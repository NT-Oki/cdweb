package com.example.movie_booking.controller.admin;

import com.example.movie_booking.dto.booking.BookingCheckoutDto;
import com.example.movie_booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("admin/bookings")
public class BookingManagerController {
    @Autowired
    BookingService bookingService;
    @GetMapping("/")
    public ResponseEntity<?> getListBookings() {
        try {
            List<BookingCheckoutDto> list = bookingService.getAllBookings();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
