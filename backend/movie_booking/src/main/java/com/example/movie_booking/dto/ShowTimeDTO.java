package com.example.movie_booking.dto;


import com.example.movie_booking.model.Showtime; // Import your Showtime entity
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.format.DateTimeFormatter; // Import for formatting time
@Getter
@Setter
@NoArgsConstructor
public class ShowTimeDTO {
    private Long id;
    private String startTime; // Định dạng "HH:MM" hoặc "HH:MM:SS" tùy ý
    private String cinema;    // Tên rạp chiếu
    private String room;      // Tên phòng chiếu

    // Constructor để chuyển đổi từ Entity Showtime sang DTO
    public ShowTimeDTO(Showtime showtime) {
        this.id = showtime.getId();
        // Định dạng thời gian bắt đầu chỉ còn giờ và phút
        this.startTime = showtime.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm"));
        // Giả sử Showtime.getRoom().getCinema().getName() trả về tên rạp
        this.cinema = showtime.getRoom().getRoomName();
        // Giả sử Showtime.getRoom().getRoomName() trả về tên phòng
        this.room = showtime.getRoom().getRoomName();
    }



}
