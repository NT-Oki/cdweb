package com.example.movie_booking.service;

import com.example.movie_booking.model.Showtime;
import com.example.movie_booking.repository.IShowTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowTimeService {
    @Autowired
    IShowTimeRepository showTimeRepository;
public Showtime getShowtime(long id) {
    return showTimeRepository.getReferenceById(id);
}
public List<Showtime> getAllShowtimes() {
    return showTimeRepository.findAll();
}
}
