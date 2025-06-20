package com.example.movie_booking.dto.booking;

import com.example.movie_booking.model.ShowTimeSeat;
import jakarta.validation.constraints.Null;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ShowtimeSeatResponseDTO {
    private long seatId;
    private Long showtimeSeatId;
    private String seatNumber;
    private String seatRow;
    private int seatColumn;
    private String description;
    private int price;
    private int status;//0: AVAILABLE 1: Selected 2 : Booked/Blocked
    private Long locked_by_user_id;
    private LocalDateTime lockedAt;
    private LocalDateTime lockExpiresAt;
    private Long bookingId;
    public ShowtimeSeatResponseDTO(ShowTimeSeat seat) {
        this.seatId = seat.getSeat().getId();
       this.showtimeSeatId=seat.getId();
       this.seatNumber=seat.getSeat().getSeatNumber();
       this.seatRow=seat.getSeat().getSeatRow();
       this.seatColumn=seat.getSeat().getSeatColumn();
       this.description=seat.getSeat().getDescription();
       this.price=seat.getSeat().getPrice();
       this.status=seat.getStatus();
       this.locked_by_user_id=seat.getLocked_by_user_id()== null ?null:seat.getLocked_by_user_id();
       this.lockedAt=seat.getLockedAt();
       this.lockExpiresAt=seat.getLockExpiresAt();
       this.bookingId=seat.getBookingId();
    }
}
