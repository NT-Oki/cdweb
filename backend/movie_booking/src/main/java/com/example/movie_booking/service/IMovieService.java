package com.example.movie_booking.service;

import com.example.movie_booking.dto.MovieDTO;
import com.example.movie_booking.model.Movie;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public interface IMovieService {
    List<MovieDTO> getFindAll();
    List<Movie> getSearchField(Map<String, Objects> params);
    void deleteById(Long id);
}
