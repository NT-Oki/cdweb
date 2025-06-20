package com.example.movie_booking.dto.booking;

import com.example.movie_booking.model.Showtime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.format.DateTimeFormatter;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
public class ChooseSeatResponseDTO {
    private long showtimeId;
    private String movieName;
    private String roomName;
    private String startTime;
    private String durationMovie;
    private List<ShowtimeSeatResponseDTO> seats;

    public ChooseSeatResponseDTO(Showtime showtime, List<ShowtimeSeatResponseDTO> seats) {
        this.showtimeId = showtime.getId();
        this.movieName = showtime.getMovie().getNameMovie();
        this.roomName = showtime.getRoom().getRoomName();
        this.startTime = showtime.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy"));
        this.durationMovie = showtime.getMovie().getDurationMovie();
        this.seats = seats;
    }
}
