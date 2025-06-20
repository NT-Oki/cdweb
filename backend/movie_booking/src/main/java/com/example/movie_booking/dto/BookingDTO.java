package com.example.movie_booking.dto;

import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@Component
public class BookingDTO {
    private long bookingId;
    private long showtimeId;
    private long userId;
    private long bookingStatusId;
    private String bookingCode;
    private Integer totalAmount;
    private List<Long> showtimeSeats;

}
