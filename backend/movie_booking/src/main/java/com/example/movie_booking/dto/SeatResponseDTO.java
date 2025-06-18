package com.example.movie_booking.dto;

import com.example.movie_booking.model.Seat;
import com.example.movie_booking.model.Showtime;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SeatResponseDTO {
    private Long id;
    private String seatNumber;
    private String description;
    private long showtimeId;
    private int price;
    private int status;
    private String movieName;
    private String roomName;

    public SeatResponseDTO(Seat seat) {
        this.id = seat.getId();
        this.seatNumber = seat.getSeatNumber();
        this.description = seat.getDescription();
        this.price = seat.getPrice();
        this.status = seat.getStatus();
        this.setShowtimeId(seat.getShowtime().getId());
    }
}
