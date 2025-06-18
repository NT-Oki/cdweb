package com.example.movie_booking.service;

import com.example.movie_booking.dto.ShowTimeDTO;
import com.example.movie_booking.model.Showtime;
import com.example.movie_booking.repository.IShowTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ShowTimeService {
    @Autowired
    IShowTimeRepository showTimeRepository;
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
}
