package com.example.movie_booking.service;

import com.example.movie_booking.dto.BookingDTO;
import com.example.movie_booking.dto.booking.BookingCheckoutDto;
import com.example.movie_booking.dto.booking.ChooseSeatResponseDTO;
import com.example.movie_booking.dto.booking.ShowtimeSeatResponseDTO;
import com.example.movie_booking.dto.payment.PaymentRequestDTO;
import com.example.movie_booking.model.*;
import com.example.movie_booking.repository.*;
import com.example.movie_booking.util.CodeGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    @Autowired
    IShowTimeSeatRepository showTimeSeatRepository;

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

    public BookingCheckoutDto addSeats(BookingDTO dto) {
        Booking booking = bookingRepository.findById(dto.getBookingId()).orElse(null);
        if (booking == null) {
            return null;
        }
        List<BookingSeat> seatList = new ArrayList<>();

        for (Long l : dto.getShowtimeSeats()) {
            BookingSeat bookingSeat = new BookingSeat();
            ShowTimeSeat showTimeSeat=showTimeSeatRepository.findById(l).orElse(null);
            if(showTimeSeat==null){
                return null;
            }
            showTimeSeat.setStatus(2);
            showTimeSeat.setBookingId(booking.getId());
            showTimeSeat.setLocked_by_user_id(booking.getUser().getId());
            showTimeSeat.setLockedAt(LocalDateTime.now());
            Seat seat = showTimeSeat.getSeat();
            bookingSeat.setBooking(booking);
            bookingSeat.setSeat(seat);
            bookingSeat.setPrice(showTimeSeat.getPrice());
            seatList.add(bookingSeat);
            showTimeSeatRepository.save(showTimeSeat);
        }
        bookingSeatRepository.deleteByBookingId(booking.getId());
        bookingSeatRepository.saveAll(seatList);
        booking.setTotalAmount(dto.getTotalAmount());
        bookingRepository.save(booking);
        BookingCheckoutDto bookingCheckoutDto=new BookingCheckoutDto(booking);
        return bookingCheckoutDto;
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
    public ChooseSeatResponseDTO getInformationForChooseSeat(long showtimeId){
        Showtime showtime=showTimeRepository.findById(showtimeId).orElse(null);
        if(showtime==null){
            return null;
        }
        List<ShowTimeSeat> showTimeSeats=showTimeSeatRepository.findByShowtimeId(showtimeId);
        List<ShowtimeSeatResponseDTO> showtimeSeatResponseDTOS=new ArrayList<>();
        for(ShowTimeSeat showTimeSeat:showTimeSeats){
            showtimeSeatResponseDTOS.add(new ShowtimeSeatResponseDTO(showTimeSeat ));
        }
        ChooseSeatResponseDTO responseDTO=new ChooseSeatResponseDTO(showtime,showtimeSeatResponseDTOS);
        return responseDTO;
    }
    public Booking paymentSuccessful(long bookingId){
        Booking booking =bookingRepository.findById(bookingId).orElse(null);
        if(booking==null){
            return null;
        }
        String bookingCode= CodeGenerator.generateBookingCode();
        booking.setCodeBooking(bookingCode);
        Booking booking1=bookingRepository.save(booking);
        return booking1;
    }
    public String buildQRContent(long bookingId) throws Exception {
        Booking booking =bookingRepository.findById(bookingId).orElse(null);
        if(booking==null){
            return null;
        }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("bookingId", bookingId);
        data.put("name", booking.getUser().getName());
        data.put("movie", booking.getShowTime().getMovie().getNameMovie());
        data.put("time", booking.getShowTime().getStartTime().format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")));
        data.put("seats", booking.getBookingSeats().stream()
                .map(s -> s.getSeat().getSeatNumber())
                .collect(Collectors.joining(",")));
        data.put("room", booking.getShowTime().getRoom().getRoomName());
        data.put("bookingCode",booking.getCodeBooking());
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(data);
    }

    public List<BookingCheckoutDto> getAllBookings() {
        List<BookingCheckoutDto> list=new ArrayList<>();
        List<Booking> bookings=bookingRepository.findByCodeBookingIsNotNull();
        for(Booking booking:bookings){
            BookingCheckoutDto bookingCheckoutDto=new BookingCheckoutDto(booking);
            list.add(bookingCheckoutDto);
        }
        return list;
    }


//    public String createQR(PaymentRequestDTO dto){
//        String qr="https://img.vietqr.io/image/BIDV-3148149366-compact.png?amount="+dto.getAmount()+
//                "&addInfo="+dto.getAddInfo();
//        return qr;
//    }

    public long countSeatsSoldByDate(LocalDate date) {
        return bookingSeatRepository.countSeatsSoldByDate(date);
    }

}
