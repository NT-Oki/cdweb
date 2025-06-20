package com.example.movie_booking.dto;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class RoomAddDTO {
    private String roomName;
    private String description;
    private int quantityNormalSeat;
    private int quantityCoupleSeat;
    private int priceNormalSeat;
    private int priceCoupleSeat;

}
