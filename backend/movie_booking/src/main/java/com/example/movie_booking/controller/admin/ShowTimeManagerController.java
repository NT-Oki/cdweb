package com.example.movie_booking.controller.admin;

import com.example.movie_booking.dto.ShowTimeAddDTO;
import com.example.movie_booking.dto.ShowTimeUpdateDTO;
import com.example.movie_booking.model.Showtime;
import com.example.movie_booking.service.ShowTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("admin/showtimes")

public class ShowTimeManagerController {
    @Autowired
    ShowTimeService showTimeService;

    @GetMapping("/")
    public ResponseEntity<List<Showtime>> getAllShowTimes() {
            List<Showtime> showtimes=showTimeService.getAllShowtimes();
            return ResponseEntity.ok(showtimes);
    }
    @PostMapping("/")
    public ResponseEntity<?> addShowTime(@RequestBody ShowTimeAddDTO dto){
        try{
            Showtime showtime=showTimeService.addShowtime(dto);
            return ResponseEntity.ok("Thêm 1 showtime thành công với Id: "+showtime.getId());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateShowTime(@PathVariable long id, ShowTimeUpdateDTO dto){
        try{
            Showtime showtime = showTimeService.update(id,dto);
            return ResponseEntity.ok("Cập nhật thành công ShowTime có Id: "+id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
