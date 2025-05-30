package com.example.movie_booking.controller;

import com.example.movie_booking.dto.BookingDTO;
import com.example.movie_booking.dto.BookingShowTimeDTO;
import com.example.movie_booking.model.Booking;
import com.example.movie_booking.model.BookingStatus;
import com.example.movie_booking.model.Showtime;
import com.example.movie_booking.model.User;
import com.example.movie_booking.service.BookingService;
import com.example.movie_booking.service.BookingStatusService;
import com.example.movie_booking.service.ShowTimeService;
import com.example.movie_booking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/booking")
public class BookingController {
    @Autowired
    BookingService bookingService;
    @Autowired
    BookingStatusService bookingStatusService;
    @Autowired
    ShowTimeService showTimeService;
    @Autowired
    UserService userService;

    @PostMapping("/show-time")
    public ResponseEntity<?> booking(@RequestBody BookingDTO dto) {//userId, showtimeId
        try {
            Booking booking = bookingService.createBooking(dto);
            Map<String, Object> map = new HashMap<>();
            map.put("booking", booking);
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Đặt vé thất bại: " + e.getMessage()));
        }
    }

    @PostMapping("/choose-seat")
    public ResponseEntity<?> chooseSeats(@RequestBody BookingDTO dto) {//bookingId, seats :[1,2,3]
        try{
        Booking booking = bookingService.addSeats(dto);
        booking=bookingService.updateTotalAmount(dto.getBookingId());
            System.out.println(booking.getTotalAmount());
        return ResponseEntity.ok(booking);
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Chọn ghế thất bại"+ e.getMessage());
        }
    }

}
