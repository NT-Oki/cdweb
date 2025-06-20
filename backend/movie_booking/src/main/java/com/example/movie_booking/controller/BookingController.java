package com.example.movie_booking.controller;

import com.example.movie_booking.dto.BookingDTO;
import com.example.movie_booking.dto.booking.ChooseSeatResponseDTO;
import com.example.movie_booking.dto.booking.SeatRequest;
import com.example.movie_booking.dto.booking.SeatResponseDTO;
import com.example.movie_booking.model.*;
import com.example.movie_booking.service.BookingService;
import com.example.movie_booking.service.BookingStatusService;
import com.example.movie_booking.service.ShowTimeService;
import com.example.movie_booking.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;

@RestController
@RequestMapping("/booking")
public class BookingController {
    @Autowired
    BookingService bookingService;

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
     * Bỏ vào kèm thông tin
     * @return
     */
    @GetMapping("/seats")
    public ResponseEntity<?> getSeats(@RequestParam Long showtimeId) {
        try{
        ChooseSeatResponseDTO responseDTO=bookingService.getInformationForChooseSeat(showtimeId);
        Map<String, Object> map = new HashMap<>();
        map.put("showtimeDetail", responseDTO);
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
