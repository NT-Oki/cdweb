package com.example.movie_booking.repository;

import com.example.movie_booking.model.ShowTimeSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IShowTimeSeatRepository extends JpaRepository<ShowTimeSeat,Long> {
}
