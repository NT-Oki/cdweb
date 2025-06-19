package com.example.movie_booking.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class BookingSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id")
    private Seat seat;

    private int price;// giá tại thời điểm order, tránh đổi giá thì hóa đơn kéo theo
}
