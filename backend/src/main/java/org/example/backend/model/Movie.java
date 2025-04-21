package org.example.backend.model;

import jakarta.persistence.*;

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
    @ManyToOne
    @JoinColumn(name = "kind_of_movie_id")
    private KindOfFilm kindOfFilm;

    public Movie() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameMovie() {
        return nameMovie;
    }

    public void setNameMovie(String nameMovie) {
        this.nameMovie = nameMovie;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getDurationMovie() {
        return durationMovie;
    }

    public void setDurationMovie(String durationMovie) {
        this.durationMovie = durationMovie;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getStudio() {
        return studio;
    }

    public void setStudio(String studio) {
        this.studio = studio;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTrailer() {
        return trailer;
    }

    public void setTrailer(String trailer) {
        this.trailer = trailer;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public StatusFilm getMovieStatusId() {
        return statusFilmId;
    }

    public void setMovieStatusId(StatusFilm statusFilmId) {
        this.statusFilmId = statusFilmId;
    }

    public KindOfFilm getKindOfFilm() {
        return kindOfFilm;
    }

    public void setKindOfFilm(KindOfFilm kindOfFilm) {
        this.kindOfFilm = kindOfFilm;
    }
}
