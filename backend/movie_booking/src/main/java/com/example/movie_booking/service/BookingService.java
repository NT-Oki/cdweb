package com.example.movie_booking.service;

import com.example.movie_booking.dto.BookingDTO;
import com.example.movie_booking.dto.BookingShowTimeDTO;
import com.example.movie_booking.dto.SeatResponseDTO;
import com.example.movie_booking.model.*;
import com.example.movie_booking.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    IBookingRepository bookingRepository;
    @Autowired
    IBookingStatusRepository bookingStatusRepository;
    @Autowired
    IUserRepository userRepository;
    @Autowired
    IShowTimeRepository showTimeRepository;
    @Autowired
    IBookingSeatRepository bookingSeatRepository;
    @Autowired
    ISeatRepository seatRepository;

    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
    }

@Transactional
    public Booking createBooking(BookingDTO dto) {
        Booking booking = new Booking();
        BookingStatus bookingStatus = bookingStatusRepository.getReferenceById(1l);
        Showtime showtime = showTimeRepository.getReferenceById(dto.getShowtimeId());
        User user = userRepository.getReferenceById(dto.getUserId());
        booking.setUser(user);
        booking.setShowTime(showtime);
        booking.setDateBooking(LocalDate.now());
        booking.setBookingStatus(bookingStatus);
        bookingRepository.save(booking);
        return booking;
    }

    public Booking getBooking(Long id) {
        return bookingRepository.getReferenceById(id);
    }

    public Booking addSeats(BookingDTO dto) {
        Booking booking = bookingRepository.getReferenceById(dto.getBookingId());
        List<BookingSeat> seatList = new ArrayList<>();
        BookingSeat bookingSeat = new BookingSeat();
        for (Long l : dto.getSeats()) {
            Seat seat = seatRepository.getReferenceById(l);
            bookingSeat.setBooking(booking);
            bookingSeat.setSeat(seat);
            bookingSeat.setPrice(seat.getPrice());
            seatList.add(bookingSeat);
        }
        bookingSeatRepository.saveAll(seatList);
        return booking;
    }
    public Booking updateTotalAmount(long id){
        Booking booking = bookingRepository.getReferenceById(id);
        List<BookingSeat> bookingSeats=booking.getBookingSeats();
        int total=0;
        for(BookingSeat bookingSeat:bookingSeats){
            total+=bookingSeat.getPrice();
        }
        booking.setTotalAmount(total);
        bookingRepository.save(booking);
        return booking;
    }
    public List<SeatResponseDTO> getAllSeatsByShowTimeId(long showtimeId){
        List<Seat> seatList=seatRepository.findByShowtimeId(showtimeId);
        List<SeatResponseDTO> seatResponseDTOS=new ArrayList<>();
        for(Seat seat:seatList){
            seatResponseDTOS.add(new SeatResponseDTO(seat));
        }
        return seatResponseDTOS;
    }

}
