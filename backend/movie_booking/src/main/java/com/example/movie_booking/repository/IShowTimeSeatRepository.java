package com.example.movie_booking.repository;

import com.example.movie_booking.model.ShowTimeSeat;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IShowTimeSeatRepository extends JpaRepository<ShowTimeSeat,Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE) // Khóa hàng trong DB khi đọc
    @Query("SELECT sts FROM ShowTimeSeat sts WHERE sts.showtime.id = :showtimeId AND sts.seat.id IN :seatIds")
    List<ShowTimeSeat> findByShowtimeIdAndSeatIdsForUpdate(@Param("showtimeId") Long showtimeId, @Param("seatIds") List<Long> seatIds);

    // Lấy ghế theo ID, khóa hàng
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<ShowTimeSeat> findById(Long id); // Override để có Pessimistic Lock
    List<ShowTimeSeat> findByShowtimeId(long id);
    List<ShowTimeSeat> findByBookingId(long id);

}
