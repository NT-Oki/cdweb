package com.example.movie_booking.service;

import com.example.movie_booking.dto.MovieDTO;
import com.example.movie_booking.model.Movie;
import com.example.movie_booking.model.StatusFilm;
import com.example.movie_booking.repository.IMovieRepository;
import com.example.movie_booking.repository.IStatusFilmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private IMovieRepository movieRepository;

    @Autowired
    private IStatusFilmRepository statusFilmRepository;

    public List<Movie> findAll() {
        return movieRepository.findAll();
    }

    public Optional<Movie> findById(Long id) {
        return movieRepository.findById(id);
    }

    public List<Movie> findActiveMovies() {
        return movieRepository.findByStatusFilmId_Id(1);
    }

    public Movie findByIdAndStatus(Long id, int statusId) {
        return movieRepository.findByIdAndStatusFilmId_Id(id, statusId);
    }

    public Movie save(MovieDTO dto) {
        Movie movie = convertToEntity(dto);
        return movieRepository.save(movie);
    }

    public void delete(Movie movie) {
        movieRepository.delete(movie);
    }

    public Movie convertToEntity(MovieDTO dto) {
        StatusFilm statusFilm = null;
        if (dto.getStatusFilmId() != null) {
            statusFilm = statusFilmRepository.findById(dto.getStatusFilmId()).orElse(null);
        }

        return Movie.builder()
                .id(dto.getId())
                .nameMovie(dto.getNameMovie())
                .releaseDate(dto.getReleaseDate())
                .durationMovie(dto.getDurationMovie())
                .actor(dto.getActor())
                .director(dto.getDirector())
                .studio(dto.getStudio())
                .content(dto.getContent())
                .trailer(dto.getTrailer())
                .avatar(dto.getAvatar())
                .statusFilmId(statusFilm)
                .build();
    }
}
