package com.example.movie_booking.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    private String nameMovie;
    private String releaseDate;
    private String durationMovie;
    private String actor;
    private String director;
    private String studio;
    private String content;
    private String trailer;
    private String avatar;
    @ManyToOne
    @JoinColumn(name = "status_movie_id")
    private StatusFilm statusFilmId;

}
