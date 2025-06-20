package com.example.movie_booking.controller;

import com.example.movie_booking.dto.BookingDTO;
import com.example.movie_booking.dto.booking.ChooseSeatResponseDTO;
import com.example.movie_booking.model.*;
import com.example.movie_booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Locale;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/booking")
public class BookingController {
    @Autowired
    BookingService bookingService;

    @Autowired
    MessageSource messageSource;

    /**
     * Buoc 1
     * tạo 1 booking mới chứa (showtime,trạng thai(1)
     * @param dto
     * @return
     */
    @PostMapping("/show-time")
    public ResponseEntity<?> booking(@RequestBody BookingDTO dto, Locale locale) {//userId, showtimeId
        try {
            Booking booking = bookingService.createBooking(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("id", booking.getId());
            response.put("message",
                    messageSource.getMessage("booking.create.success", new Object[]{booking.getId()}, locale));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            messageSource.getMessage("booking.create.failed", new Object[]{e.getMessage()}, locale)));
        }
    }

    /**
     * Bước 2
     * Lấy tất cả seat của showtime được chọn đó ra
     * Bỏ vào kèm thông tin
     * @return
     */
    @GetMapping("/seats")
    public ResponseEntity<?> getSeats(@RequestParam Long showtimeId, Locale locale) {
        try{
        ChooseSeatResponseDTO responseDTO=bookingService.getInformationForChooseSeat(showtimeId);
        Map<String, Object> map = new HashMap<>();
        map.put("showtimeDetail", responseDTO);
        return ResponseEntity.ok(map);
        } catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of("error",
                    messageSource.getMessage("booking.seats.get.failed", new Object[]{e.getMessage()}, locale)));
        }
    }

    @PostMapping("/choose-seat")
    public ResponseEntity<?> chooseSeats(@RequestBody BookingDTO dto, Locale locale) {//bookingId, seats :[1,2,3]
        try{
        Booking booking = bookingService.addSeats(dto);
        booking=bookingService.updateTotalAmount(dto.getBookingId());
            System.out.println(booking.getTotalAmount());
        return ResponseEntity.ok(booking);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(Map.of("error",
                    messageSource.getMessage("booking.seats.failed", new Object[]{e.getMessage()}, locale)));
        }
    }
}
