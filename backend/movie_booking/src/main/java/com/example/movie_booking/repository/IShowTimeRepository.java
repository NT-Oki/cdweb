package com.example.movie_booking.repository;

import com.example.movie_booking.model.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IShowTimeRepository extends JpaRepository<Showtime,Long> {
    List<Showtime> findByMovieId(Long movieId);

}
