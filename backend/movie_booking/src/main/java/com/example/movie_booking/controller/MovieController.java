package com.example.movie_booking.controller;


import com.example.movie_booking.dto.MovieDTO;
import com.example.movie_booking.service.IMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MovieController {
    @Autowired
    private IMovieService iMovieService;
    @GetMapping("/list-movie")
    public List<MovieDTO> getFindAll(){
        return iMovieService.getFindAll();
    }
}
