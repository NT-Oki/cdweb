package com.example.movie_booking.dto;

import lombok.Data;

@Data
public class RoomUpdateDTO {
    private String roomName;
    private String description;
    private int status;
    private int priceNormalSeat;
    private int priceCoupleSeat;
}

