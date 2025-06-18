package com.example.movie_booking.controller;

import com.example.movie_booking.dto.BookingDTO;
import com.example.movie_booking.dto.BookingShowTimeDTO;
import com.example.movie_booking.dto.SeatResponseDTO;
import com.example.movie_booking.model.*;
import com.example.movie_booking.service.BookingService;
import com.example.movie_booking.service.BookingStatusService;
import com.example.movie_booking.service.ShowTimeService;
import com.example.movie_booking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
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


    /**
     * Buoc 1
     * tạo 1 booking mới chứa (showtime,trạng thai(1)
     * @param dto
     * @return
     */
    @PostMapping("/show-time")
    public ResponseEntity<?> booking(@RequestBody BookingDTO dto) {//userId, showtimeId
        try {
            Booking booking = bookingService.createBooking(dto);
            Map<String, Object> map = new HashMap<>();
            map.put("id", booking.getId());
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Đặt vé thất bại: " + e.getMessage()));
        }
    }

    /**
     * Bước 2
     * Lấy tất cả seat của showtime được chọn đó ra
     * @return
     */
    @GetMapping("/seats")
    public ResponseEntity<?> getSeats(@RequestParam Long showtimeId) {
        try{
        List<SeatResponseDTO> seatResponseDTOS=bookingService.getAllSeatsByShowTimeId(showtimeId);
        Map<String, Object> map = new HashMap<>();
        map.put("seats", seatResponseDTOS);
        return ResponseEntity.ok(map);
        } catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
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
