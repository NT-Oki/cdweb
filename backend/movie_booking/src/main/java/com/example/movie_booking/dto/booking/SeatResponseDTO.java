package com.example.movie_booking.dto.booking;

import com.example.movie_booking.model.Seat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.format.DateTimeFormatter;

@Getter
@Setter
@NoArgsConstructor
public class SeatResponseDTO {
    private Long id;
    private String seatNumber;
    private String description;
    private int price;
    private int status;
    public SeatResponseDTO(Seat seat) {
        this.id = seat.getId();
        this.seatNumber = seat.getSeatNumber();
        this.description = seat.getDescription();
        this.price = seat.getPrice();
        this.status = seat.getStatus();
    }
}
