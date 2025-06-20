package com.example.movie_booking.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String codeBooking;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private LocalDate dateBooking;
    private Integer totalAmount;//tổng giá của 1 lần order
    @ManyToOne
    @JoinColumn(name = "booking_status_id")
    private BookingStatus bookingStatus;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "showtime_id")
    private Showtime showTime;
    private String paymentId;
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)//orphanRemoval = true giúp tự động xóa ghế nếu bị xóa khỏi danh sách.
    private List<BookingSeat> bookingSeats;

}
