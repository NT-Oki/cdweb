package com.example.movie_booking.controller;


import com.example.movie_booking.dto.MovieDTO;
import com.example.movie_booking.dto.ShowTimeDTO;
import com.example.movie_booking.model.Movie;
import com.example.movie_booking.model.Showtime;
import com.example.movie_booking.service.MovieService;
import com.example.movie_booking.service.ShowTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Locale;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private ShowTimeService showTimeService;

    @Autowired
    private MessageSource messageSource;

    // Lấy danh sách phim có status = 1 (active)
    @GetMapping("/list")
    public ResponseEntity<List<Movie>> listActiveMovies() {
        List<Movie> activeMovies = movieService.findActiveMovies();
        return ResponseEntity.ok(activeMovies);
    }

    // Lấy chi tiết phim (chỉ nếu status = 1)
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getMovieDetail(@PathVariable Long id, Locale locale) {
        Movie movie = movieService.findByIdAndStatus(id, 1);
        if (movie == null) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    messageSource.getMessage("movie.inactive", null, locale)));
        }
        // Gọi phương thức nhóm suất chiếu
        Map<String, List<ShowTimeDTO>> groupedShowtimes = showTimeService.getShowtimesGroupedByDateFormatted(id);
        Map<String,Object> map=new HashMap<>();
        map.put("movie",movie);
        map.put("showtimes",groupedShowtimes);
        return ResponseEntity.ok(map);
    }
}
