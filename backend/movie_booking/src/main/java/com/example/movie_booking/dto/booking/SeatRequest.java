package com.example.movie_booking.dto.booking;

import lombok.Data;

@Data
public class SeatRequest {
     private Long showtimeId;
     private Long showtimeSeatId;
     private Long userId;
}
