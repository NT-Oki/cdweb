package com.example.movie_booking.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String roomName;
    private int totalSeats;
    private int status;//1 : active 2: inactive 3: deleted
    private String description;
    private int quantityNormalSeat;
    private int quantityCoupleSeat;
    private int priceNormalSeat;
    private int priceCoupleSeat;

}
