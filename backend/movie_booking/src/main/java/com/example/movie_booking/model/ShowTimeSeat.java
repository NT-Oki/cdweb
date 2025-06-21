package com.example.movie_booking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowTimeSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;
    @Column(nullable = true)
    private Long locked_by_user_id;
    @Column(nullable = true)
    private LocalDateTime lockedAt;
    @Column(nullable = true)
    private LocalDateTime lockExpiresAt;
    @Column(nullable = true)
    private Long bookingId;
    private int price;
    private int status; //0: AVAILABLE 1: Selected 2 : Booked/Blocked




}
