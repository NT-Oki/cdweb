package com.example.movie_booking.service;

import com.example.movie_booking.dto.RoomAddDTO;
import com.example.movie_booking.dto.RoomUpdateDTO;
import com.example.movie_booking.model.Room;
import com.example.movie_booking.model.Seat;
import com.example.movie_booking.repository.IRoomRepository;
import com.example.movie_booking.repository.ISeatRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import java.util.Locale;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {
    @Autowired
    IRoomRepository roomRepository;

    @Autowired
    ISeatRepository seatRepository;

    @Autowired
    MessageSource messageSource;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    public Room delete(long id){
        Room room = roomRepository.findById(id).orElse(null);
        if(room==null){
            return null;
        }
        room.setStatus(3);
        roomRepository.save(room);
        return room;
    }
    public Room update(Long id,RoomUpdateDTO room){
        try {
            Room roomCurrent = roomRepository.findById(id).orElse(null);
            if (roomCurrent == null) {
                return null;
            }
            roomCurrent.setRoomName(room.getRoomName());
            roomCurrent.setDescription(room.getDescription());
            roomCurrent.setPriceNormalSeat(room.getPriceNormalSeat());
            roomCurrent.setPriceCoupleSeat(room.getPriceCoupleSeat());
            roomCurrent.setStatus(room.getStatus());
            Room savedRoom = roomRepository.save(roomCurrent);
            return savedRoom;
        } catch (DataIntegrityViolationException ex) {
            return null;
        } catch (Exception ex) {
            return null;

        }

    }
    /**
     * Thêm một phòng chiếu mới và tự động tạo các bản ghi Seat (ghế vật lý)
     * dựa trên số lượng ghế thường và ghế đôi đã định nghĩa trong Room.
     *
     * @param dto Đối tượng Room cần thêm.
     * @return Đối tượng Room đã được lưu và khởi tạo Seat.
     * @throws IllegalArgumentException Nếu số lượng ghế không hợp lệ.
     */
    @Transactional // Đảm bảo toàn bộ hoạt động là một giao dịch
    public Room addRoom(RoomAddDTO dto, Locale locale) {
        // Bước 1: Kiểm tra và lưu Room cơ bản
        if (dto.getQuantityNormalSeat() < 0 || dto.getQuantityCoupleSeat() < 0) {
            throw new IllegalArgumentException(messageSource.getMessage("room.seats.invalid", null, locale));
        }

        Room room = Room.builder()
                        .roomName(dto.getRoomName())
                .totalSeats(dto.getQuantityNormalSeat()+dto.getQuantityCoupleSeat())
                .status(1)
                .description(dto.getDescription())
                .quantityNormalSeat(dto.getQuantityNormalSeat())
                .quantityCoupleSeat(dto.getQuantityCoupleSeat())
                .priceNormalSeat(dto.getPriceNormalSeat())
                .priceCoupleSeat(dto.getPriceCoupleSeat())
                .build();

        Room saved=roomRepository.save(room);

        // Bước 2: Tạo danh sách các Seat cho phòng này
        List<Seat> seatsToCreate = new ArrayList<>();
        int maxColumnsPerRow = 15;//sô cột mỗi hàng
        char currentRowChar = 'A';// hàng
        int currentColumn = 1; // số cột hiện tại

        // Tạo ghế  thường
        for (int i = 0; i < dto.getQuantityNormalSeat(); i++) {
            Seat seat = Seat.builder()
                    .seatRow(String.valueOf(currentRowChar))
                    .seatColumn(currentColumn)
                    .seatNumber(String.valueOf(currentRowChar) + currentColumn)
                    .description("Ghế thường")
                    .price(dto.getPriceNormalSeat())
                    .status(0)
                    .room(saved)
                    .build();
            seatsToCreate.add(seat);
            currentColumn++;
            if (currentColumn > maxColumnsPerRow) { // Nếu vượt quá số cột tối đa, chuyển sang hàng mới
                currentColumn = 1;
                currentRowChar++; // Chuyển sang chữ cái tiếp theo (B, C, ...)

            }
        }

        // Tạo ghế đôi
        currentRowChar++;
        currentColumn=1;
        maxColumnsPerRow = 5;
        for (int i = 0; i < dto.getQuantityCoupleSeat(); i++) {
            Seat seat = Seat.builder()
                    .seatRow(String.valueOf(currentRowChar))
                    .seatColumn(currentColumn)
                    .seatNumber(String.valueOf(currentRowChar) + currentColumn)
                    .description("Ghế đôi")
                    .price(dto.getPriceCoupleSeat())
                    .status(0)
                    .room(saved)
                    .build();
            seatsToCreate.add(seat);
            currentColumn++;
            if (currentColumn > maxColumnsPerRow) { // Nếu vượt quá số cột tối đa, chuyển sang hàng mới
                currentColumn = 1;
                currentRowChar++; // Chuyển sang chữ cái tiếp theo (B, C, ...)
            }
        }
        // Bước 3: Lưu tất cả các Seat vào database
        seatRepository.saveAll(seatsToCreate);

        System.out.println("Successfully thêm phòng " + saved.getId() +
                " và tạo " + seatsToCreate.size() + " ghế");

        return saved;
    }


}
