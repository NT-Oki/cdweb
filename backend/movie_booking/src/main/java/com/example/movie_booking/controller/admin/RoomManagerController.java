package com.example.movie_booking.controller.admin;

import com.example.movie_booking.dto.RoomAddDTO;
import com.example.movie_booking.model.Room;
import com.example.movie_booking.service.RoomService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/rooms")
public class RoomManagerController {
    @Autowired
    RoomService roomService;
    @GetMapping("list-room")
    public ResponseEntity<List<Room>> listRooms() {
        List<Room> roomList=roomService.getAllRooms();
        return ResponseEntity.ok(roomList);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<?> room(@PathVariable Long id) {
        try{
            roomService.delete(id);
            return ResponseEntity.ok("Đã xóa thành công");
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Xóa thất bại");
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody Room room) {
       Room result= roomService.update(room);
       if (result != null) {
           return ResponseEntity.ok("Cập nhật thông tin phòng thành công");
       }else{
           return ResponseEntity.badRequest().body("Cập nhật thông tin phòng thất bại");
       }
    }
    @PostMapping("/add")
    public ResponseEntity<?> addRoom(@RequestBody RoomAddDTO dto) {
            try {
                roomService.add(dto);
                return ResponseEntity.ok("Thêm phòng thành công");
            }catch (Exception e){
                return ResponseEntity.badRequest().body("Thêm phòng thất bại");
            }


    }

}
