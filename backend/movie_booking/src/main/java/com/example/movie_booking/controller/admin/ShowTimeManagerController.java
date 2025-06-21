package com.example.movie_booking.controller.admin;

import com.example.movie_booking.dto.ShowTimeAddDTO;
import com.example.movie_booking.dto.ShowTimeUpdateDTO;
import com.example.movie_booking.model.Showtime;
import com.example.movie_booking.service.ShowTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Locale;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("admin/showtimes")

public class ShowTimeManagerController {
    @Autowired
    ShowTimeService showTimeService;

    @Autowired
    MessageSource messageSource;

    @GetMapping("/")
    public ResponseEntity<List<Showtime>> getAllShowTimes() {
            List<Showtime> showtimes=showTimeService.getAllShowtimes();
            return ResponseEntity.ok(showtimes);
    }
    @PostMapping("/")
    public ResponseEntity<?> addShowTime(@RequestBody ShowTimeAddDTO dto, Locale locale){
        try{
            Showtime showtime=showTimeService.addShowtime(dto, locale);
            return ResponseEntity.ok(Map.of("message",
                    messageSource.getMessage("showtime.add.success", new Object[]{showtime.getId()}, locale)));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    messageSource.getMessage("showtime.add.failed", new Object[]{e.getMessage()}, locale)));
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateShowTime(@PathVariable long id, ShowTimeUpdateDTO dto, Locale locale){
        try{
            Showtime showtime = showTimeService.update(id,dto);
            return ResponseEntity.ok(Map.of("message",
                    messageSource.getMessage("showtime.update.success", new Object[]{id}, locale)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    messageSource.getMessage("showtime.update.failed", new Object[]{e.getMessage()}, locale)));
        }
    }
    @PostMapping("/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable long id){
        try{
            Showtime showtime = showTimeService.updateStatusShowTime(id);
            return ResponseEntity.ok(showtime);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
