package org.example.backend.service;

import org.example.backend.dto.MovieDTO;
import org.example.backend.model.Movie;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public interface IMovieService {
    List<MovieDTO> getFindAll();
    List<Movie> getSearchField(Map<String, Objects> params);
    void deleteById(Long id);
}
