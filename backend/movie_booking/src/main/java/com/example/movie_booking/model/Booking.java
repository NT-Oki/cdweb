package com.example.movie_booking.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String codeBooking;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate dateBooking;
    private double totalAmount;
    @ManyToOne
    @JoinColumn(name = "booking_status_id")
    private BookingStatus bookingStatus;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "showtime_id")
    private Showtime showTime;
    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

}
