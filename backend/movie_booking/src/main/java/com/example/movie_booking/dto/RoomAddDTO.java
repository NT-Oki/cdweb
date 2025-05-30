package com.example.movie_booking.dto;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class RoomAddDTO {
    private String roomName;
    private int quantitySeat;
    private String status;
    private String description;
}
