package org.example.backend.repository;



import org.example.backend.model.StatusFilm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IMovieStatusRepository extends JpaRepository<StatusFilm, Long> {
}
