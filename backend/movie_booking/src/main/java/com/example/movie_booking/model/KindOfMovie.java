package com.example.movie_booking.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class KindOfMovie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "kind_of_film_id", nullable = false)
    private KindOfFilm kindOfFilm;
}
