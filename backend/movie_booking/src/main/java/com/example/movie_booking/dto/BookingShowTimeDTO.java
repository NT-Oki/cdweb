package com.example.movie_booking.dto;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
public class BookingShowTimeDTO {
    private Long showtimeId;
    private Long userId;
}
