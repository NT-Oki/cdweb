package com.example.movie_booking.controller.admin;

import com.example.movie_booking.dto.MovieDTO;
import com.example.movie_booking.model.Movie;
import com.example.movie_booking.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/movies")
public class MovieManagerController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private MessageSource messageSource;

    // Lấy danh sách phim
    @GetMapping("/list")
    public ResponseEntity<List<Movie>> list() {
        return ResponseEntity.ok(movieService.findAll());
    }

    // Thêm / Cập nhật phim
    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody MovieDTO dto, BindingResult result, Locale locale) {
        Map<String, String> errors = new HashMap<>();

        if (result.hasErrors()) {
            result.getFieldErrors().forEach(err ->
                    errors.put(err.getField(), messageSource.getMessage(err.getDefaultMessage(), null, locale))
            );
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        Movie savedMovie = movieService.save(dto);
        return ResponseEntity.ok(Map.of("message", messageSource.getMessage("movie.add.success", null, locale), "movie", savedMovie));
    }

    // Xem chi tiết phim
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable Long id, Locale locale) {
        Optional<Movie> movieOpt = movieService.findById(id);
        if (movieOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("id", messageSource.getMessage("movie.notfound", null, locale));
            return ResponseEntity.badRequest().body(error);
        }
        return ResponseEntity.ok(movieOpt.get());
    }

    // Xóa phim
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Locale locale) {
        Optional<Movie> movieOpt = movieService.findById(id);
        if (movieOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("id", messageSource.getMessage("movie.notfound", null, locale));
            return ResponseEntity.badRequest().body(error);
        }
        movieService.delete(movieOpt.get());

        Map<String, String> success = new HashMap<>();
        success.put("message", messageSource.getMessage("movie.delete.success", null, locale));
        return ResponseEntity.ok(success);
    }
}