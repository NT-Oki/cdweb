package com.example.movie_booking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Null;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String seatNumber;// A1, B5, etc.
    private String seatRow;//hàng A, B, C
    private int seatColumn;//cột1 2 3 4
    private String description;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private Room room;
    private int price;
    private int status;// 0: ACTIVE,1 : BROKEN, 2: MAINTENANCE
}
