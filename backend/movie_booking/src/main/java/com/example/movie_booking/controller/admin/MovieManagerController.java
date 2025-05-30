package com.example.movie_booking.controller.admin;

import com.example.movie_booking.dto.MovieDTO;
import com.example.movie_booking.model.Movie;
import com.example.movie_booking.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin/movies")
public class MovieManagerController {

    @Autowired
    private MovieService movieService;

    // Lấy danh sách phim
    @GetMapping("/list")
    public ResponseEntity<List<Movie>> list() {
        return ResponseEntity.ok(movieService.findAll());
    }

    // Thêm / Cập nhật phim
    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody MovieDTO dto, BindingResult result) {
        Map<String, String> errors = new HashMap<>();

        if (result.hasErrors()) {
            result.getFieldErrors().forEach(err ->
                    errors.put(err.getField(), err.getDefaultMessage())
            );
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        Movie savedMovie = movieService.save(dto);
        return ResponseEntity.ok(savedMovie);
    }

    // Xem chi tiết phim
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable Long id) {
        Optional<Movie> movieOpt = movieService.findById(id);
        if (movieOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("id", "Không tìm thấy phim");
            return ResponseEntity.badRequest().body(error);
        }
        return ResponseEntity.ok(movieOpt.get());
    }

    // Xóa phim
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Movie> movieOpt = movieService.findById(id);
        if (movieOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("id", "Không tìm thấy phim để xóa");
            return ResponseEntity.badRequest().body(error);
        }
        movieService.delete(movieOpt.get());

        Map<String, String> success = new HashMap<>();
        success.put("message", "Xóa phim thành công");
        return ResponseEntity.ok(success);
    }
}
