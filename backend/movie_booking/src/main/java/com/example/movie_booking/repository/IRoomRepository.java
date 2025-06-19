package com.example.movie_booking.repository;

import com.example.movie_booking.model.Room;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IRoomRepository extends JpaRepository<Room, Long> {
//    @Modifying
//    @Transactional
//    @Query("UPDATE Room r SET r.status = '3' WHERE r.id = :id")
//    void updateStatusById(@Param("id") Long id);

}
