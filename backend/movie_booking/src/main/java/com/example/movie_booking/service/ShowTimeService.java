package com.example.movie_booking.service;

import com.example.movie_booking.dto.ShowTimeAddDTO;
import com.example.movie_booking.dto.ShowTimeDTO;
import com.example.movie_booking.dto.ShowTimeUpdateDTO;
import com.example.movie_booking.model.*;
import com.example.movie_booking.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import java.util.Locale;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ShowTimeService {
    @Autowired
    IShowTimeRepository showTimeRepository;

    @Autowired
    IShowTimeSeatRepository showtimeSeatRepository;

    @Autowired
    ISeatRepository seatRepository;

    @Autowired
    IMovieRepository movieRepository;

    @Autowired
    IRoomRepository roomRepository;

    @Autowired
    MessageSource messageSource;
    @Autowired
    IStatusFilmRepository statusFilmRepository;

public Showtime getShowtime(long id) {
    return showTimeRepository.getReferenceById(id);
}
public List<Showtime> getAllShowtimes() {
    return showTimeRepository.findAll();
}
public List<Showtime> getShowTimeByMovieId(long movieId) {
    return showTimeRepository.findByMovieId(movieId);
}

    /**
     * Lấy tất cả suất chiếu cho một bộ phim, nhóm chúng theo ngày, và
     * trả về dưới dạng Map<String, List<ShowtimeDto>> với key là chuỗi ngày định dạng "YYYY-MM-DD"
     * để dễ dàng serialize sang JSON và phía frontend dễ dùng hơn.
     * Các suất chiếu trong mỗi ngày cũng được sắp xếp theo thời gian bắt đầu.
     *
     * @param movieId ID của bộ phim
     * @return Map với key là chuỗi ngày (YYYY-MM-DD) và value là danh sách ShowtimeDto của ngày đó.
     */
    public Map<String, List<ShowTimeDTO>> getShowtimesGroupedByDateFormatted(Long movieId) {
        List<Showtime> allShowtimes = showTimeRepository.findByMovieId(movieId);

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Map<String, List<ShowTimeDTO>> groupedShowtimes = allShowtimes.stream()
                .collect(Collectors.groupingBy(
                        showtime -> showtime.getShowDate().format(dateFormatter), // Key là chuỗi ngày
                        Collectors.collectingAndThen(
                                // CHUYỂN ĐỔI TỪ SHOWTIME ENTITY SANG SHOWTIMEDTO
                                Collectors.mapping(ShowTimeDTO::new, Collectors.toList()),
                                list -> {
                                    // Sắp xếp các ShowtimeDto theo thời gian bắt đầu
                                    // Vì startTime trong DTO là String "HH:mm", so sánh chuỗi cũng sẽ hoạt động tốt nếu định dạng giờ là 2 chữ số
                                    list.sort(Comparator.comparing(ShowTimeDTO::getStartTime));
                                    return list;
                                }
                        )
                ));

        return groupedShowtimes;
    }

    /**
     * Thêm một suất chiếu mới và tự động tạo các bản ghi ShowtimeSeat tương ứng
     * cho tất cả các ghế vật lý trong phòng của suất chiếu đó.
     *
     * @param dto Đối tượng Showtime cần thêm.
     * @return Đối tượng Showtime đã được lưu và khởi tạo ShowtimeSeat.
     * @throws IllegalArgumentException Nếu room hoặc movie trong newShowtime không hợp lệ.
     */
    @Transactional // Đảm bảo toàn bộ hoạt động (lưu showtime và showtimeseat) là một giao dịch
    public Showtime addShowtime(ShowTimeAddDTO dto, Locale locale) {
        Movie movie=movieRepository.findByIdAndStatusFilmId_Id(dto.getMovieId(),1);
        Room room=roomRepository.findById(dto.getRoomId()).orElse(null);
        // Bước 1: Kiểm tra và lưu Showtime cơ bản
        if (movie == null || room == null) {
            throw new IllegalArgumentException(messageSource.getMessage("showtime.invalid", null, locale));
        }
        Showtime showtime= Showtime.builder()
                .movie(movie)
                .room(room)
                .showDate(dto.getShowDate())
                .startTime(dto.getStartTime())
                .build();
        Showtime saved = showTimeRepository.save(showtime);

        // Bước 2: Lấy tất cả các ghế (Seat) của phòng chiếu liên quan đến Showtime này
        List<Seat> seatsInRoom = seatRepository.findByRoomId(saved.getRoom().getId());

        if (seatsInRoom.isEmpty()) {
            System.out.println("Warning: Room " + room.getRoomName() + " has no seats defined.");
            return saved; // Vẫn trả về showtime, nhưng không có ghế nào được tạo
        }

        // Bước 3: Tạo danh sách các ShowtimeSeat ban đầu (tất cả đều AVAILABLE)
        List<ShowTimeSeat> showtimeSeatsToCreate = new ArrayList<>();
        for (Seat physicalSeat : seatsInRoom) {
            ShowTimeSeat showtimeSeat = ShowTimeSeat.builder()
                    .showtime(saved)
                    .seat(physicalSeat)
                    .status(0) // Trạng thái ban đầu là AVAILABLE
                    .price(physicalSeat.getPrice()) // Lấy giá từ ghế làm giá mặc định
                    .locked_by_user_id(null)
                    .build();
            showtimeSeatsToCreate.add(showtimeSeat);
        }

        // Bước 4: Lưu tất cả các ShowtimeSeat vào database
        showtimeSeatRepository.saveAll(showtimeSeatsToCreate);

        System.out.println("Successfully added Showtime " + saved.getId() +
                " and created " + showtimeSeatsToCreate.size() + " ShowtimeSeats.");

        return saved;
    }
    public Showtime update(long id, ShowTimeUpdateDTO dto){
        return null;
    }
    public Showtime updateStatusShowTime(long id){
        Showtime showtime = showTimeRepository.findById(id).orElse(null);
        if(showtime==null){
            return null;
        }
        StatusFilm statusFilm = statusFilmRepository.getReferenceById(3L);
        showtime.getMovie().setStatusFilmId(statusFilm);
        Showtime showtime1=showTimeRepository.save(showtime);
        return showtime1;
    }
}
