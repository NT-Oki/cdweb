package com.example.movie_booking.repository;


import com.example.movie_booking.model.StatusFilm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IMovieStatusRepository extends JpaRepository<StatusFilm, Long> {
}
