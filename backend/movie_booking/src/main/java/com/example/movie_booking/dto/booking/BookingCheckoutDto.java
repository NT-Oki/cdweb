package com.example.movie_booking.dto.booking;

import com.example.movie_booking.model.Booking;
import com.example.movie_booking.model.BookingSeat;
import com.example.movie_booking.model.Seat;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Getter
@Setter
public class BookingCheckoutDto {
    private long bookingId;
    private long userId;
    private List<String> nameSeats;
    private int quantityNormalSeat;
    private int totalPriceNormalSeat;
    private int quantityCoupleSeat;
    private int totalPriceCoupleSeat;
    private int totalPrice;
    private String movieName;
    private String startTime;
    private String roomName;
    private String bookingCode;
    private String userName;
    private String userEmail;
    private String userCode;
    public BookingCheckoutDto(Booking booking) {
        List<String> nameSeats = new ArrayList<>();
        int quantityNormalSeat = 0;
        int quantityCoupleSeat = 0;
        int totalPriceNormalSeat = 0;
        int totalPriceCoupleSeat = 0;
        this.bookingId = booking.getId();
        this.userId = booking.getUser().getId();
        for (BookingSeat seat : booking.getBookingSeats()){
            nameSeats.add(seat.getSeat().getSeatNumber());
            if(seat.getSeat().getDescription().equals("Ghế thường")){
                quantityNormalSeat++;
                totalPriceNormalSeat += seat.getPrice();
            }else if(seat.getSeat().getDescription().equals("Ghế đôi")){
                quantityCoupleSeat++;
                totalPriceCoupleSeat += seat.getPrice();
            }
        }
        this.nameSeats = nameSeats;
        this.quantityNormalSeat = quantityNormalSeat;
        this.quantityCoupleSeat = quantityCoupleSeat;
        this.totalPriceNormalSeat = totalPriceNormalSeat;
        this.totalPriceCoupleSeat = totalPriceCoupleSeat;
        this.totalPrice = booking.getTotalAmount()==null?null   :booking.getTotalAmount();
        this.movieName=booking.getShowTime().getMovie().getNameMovie();
        this.startTime=booking.getShowTime().getStartTime().format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy"));
        this.roomName=booking.getShowTime().getRoom().getRoomName();
        this.bookingCode=booking.getCodeBooking()==null?null:booking.getCodeBooking();
        this.userName=booking.getUser().getName();
        this.userEmail=booking.getUser().getEmail();
        this.userCode=booking.getUser().getCode();
    }



}
