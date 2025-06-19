package com.example.movie_booking.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ShowTimeAddDTO {
    private Long movieId;
    private Long roomId;
    private LocalDate showDate;
    private LocalDateTime startTime ;
}
