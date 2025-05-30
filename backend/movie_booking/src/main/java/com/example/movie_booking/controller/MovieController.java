package com.example.movie_booking.controller;


import com.example.movie_booking.dto.MovieDTO;
import com.example.movie_booking.model.Movie;
import com.example.movie_booking.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // Lấy danh sách phim có status = 1 (active)
    @GetMapping("/list")
    public ResponseEntity<List<Movie>> listActiveMovies() {
        List<Movie> activeMovies = movieService.findActiveMovies();
        return ResponseEntity.ok(activeMovies);
    }

    // Lấy chi tiết phim (chỉ nếu status = 1)
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getMovieDetail(@PathVariable Long id) {
        Movie movie = movieService.findByIdAndStatus(id, 1);
        if (movie == null) {
            return ResponseEntity.badRequest().body("Phim không tồn tại hoặc không hoạt động.");
        }
        return ResponseEntity.ok(movie);
    }
}
