package com.example.movie_booking.controller;

import com.example.movie_booking.dto.BookingDTO;
import com.example.movie_booking.dto.booking.BookingCheckoutDto;
import com.example.movie_booking.dto.booking.ChooseSeatResponseDTO;
import com.example.movie_booking.dto.payment.PaymentRequestDTO;
import com.example.movie_booking.model.*;
import com.example.movie_booking.service.BookingService;
import com.example.movie_booking.util.CodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Base64;
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
        System.out.println("hiiiiiiiiiiii");
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

    /**
     * Lưu danh sách ghế chọn vào booking
     *
     * @param dto
     * @return
     */
    @PostMapping("/choose-seat")
    public ResponseEntity<?> chooseSeats(@RequestBody BookingDTO dto, Locale locale) {//bookingId, seats :[1,2,3]
        try{
        BookingCheckoutDto checkoutDto = bookingService.addSeats(dto);
        return ResponseEntity.ok(checkoutDto);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(Map.of("error",
                    messageSource.getMessage("booking.seats.failed", new Object[]{e.getMessage()}, locale)));
        }
    }
//    @PostMapping("/payment")
//    public ResponseEntity<?> payment(@RequestBody PaymentRequestDTO dto) {
//        String qr = bookingService.createQR(dto);
//        return ResponseEntity.ok(qr);
//    }

    @PostMapping("/payment-sucessful/{bookingId}")
    public ResponseEntity<?> createBookingSuccessful(@PathVariable long bookingId) {
        try{
            Booking booking=bookingService.paymentSuccessful(bookingId);
            Map<String, Object> map = new HashMap<>();
            map.put("id", booking.getId());
            return ResponseEntity.ok(map);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
@GetMapping("/ticket/{bookingId}")
public ResponseEntity<?> getQRCode(@PathVariable long bookingId) {
    try {
        // Giả sử lấy dữ liệu từ DB (ở đây hardcode để demo)
        String qrContent = bookingService.buildQRContent(bookingId);
        Booking booking=bookingService.getBooking(bookingId);
        BookingCheckoutDto bookingCheckoutDto=new BookingCheckoutDto(booking);
        byte[] image = CodeGenerator.generateQRCodeImage(qrContent, 300, 300);
        String imageBase64 = Base64.getEncoder().encodeToString(image);
        HttpHeaders headers = new HttpHeaders();

        Map<String,Object> map = new HashMap<>();
        map.put("image", imageBase64);
        map.put("bookingCheckoutDto",bookingCheckoutDto);
        return ResponseEntity.ok().body(map);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().build();
    }
}
}
