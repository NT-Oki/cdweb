package com.example.movie_booking.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ShowtimeSeatStatusUpdate {
    private Long showtimeSeatId;
    private int newStatus;
    private Long userId;
}
