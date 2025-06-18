package com.example.movie_booking.service;

import com.example.movie_booking.model.Seat;
import com.example.movie_booking.repository.ISeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {
    @Autowired
    ISeatRepository seatRepository;
    public List<Seat> getAllByShowTimeId(long roomId) {
        return seatRepository.findByRoomId(roomId);
    }

}
