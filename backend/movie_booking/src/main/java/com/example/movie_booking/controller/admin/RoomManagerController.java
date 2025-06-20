package com.example.movie_booking.controller.admin;

import com.example.movie_booking.dto.RoomAddDTO;
import com.example.movie_booking.dto.RoomUpdateDTO;
import com.example.movie_booking.model.Room;
import com.example.movie_booking.service.RoomService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.Locale;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/rooms")
public class RoomManagerController {
    @Autowired
    RoomService roomService;

    @Autowired
    MessageSource messageSource;

    @GetMapping("list-room")
    public ResponseEntity<List<Room>> listRooms() {
        List<Room> roomList=roomService.getAllRooms();
        return ResponseEntity.ok(roomList);
    }

    @PutMapping("/soft-delete/{id}")
    public ResponseEntity<?> room(@PathVariable Long id, Locale locale) {
        try{
            roomService.delete(id);
            return ResponseEntity.ok(Map.of("message", messageSource.getMessage("room.delete.success", null, locale)));
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", messageSource.getMessage("room.delete.failed", null, locale)));
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody RoomUpdateDTO room, Locale locale) {
       Room result= roomService.update(id,room);
       if (result != null) {
           return ResponseEntity.ok(Map.of("message", messageSource.getMessage("room.update.success", null, locale)));
       }else{
           return ResponseEntity.badRequest().body(Map.of("error", messageSource.getMessage("room.update.failed", null, locale)));
       }
    }
    @PostMapping("/add")
    public ResponseEntity<?> addRoom(@RequestBody RoomAddDTO dto, Locale locale) {
        try {
            roomService.addRoom(dto, locale);
            return ResponseEntity.ok(Map.of("message", messageSource.getMessage("room.add.success", null, locale)));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(Map.of("error", messageSource.getMessage("room.add.failed", null, locale)));
        }
    }

}
