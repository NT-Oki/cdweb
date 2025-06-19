//package com.example.movie_booking.service;
//
//import com.example.movie_booking.model.Seat;
//import com.example.movie_booking.repository.ISeatRepository;
//import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//
//@Service
//public class SeatCleanupService {
//
//    @Autowired
//    private ISeatRepository seatRepository;
//    @Autowired
//    private SimpMessagingTemplate messagingTemplate;
//
//    // Chạy mỗi 30 giây để kiểm tra các ghế hết hạn
//    @Scheduled(fixedRate = 30000) // 30000 ms = 30 giây
//    @Transactional
//    public void cleanupExpiredLocks() {
//        List<Seat> expiredSeats = seatRepository.findByStatusAndLockExpiresAtBefore("LOCKED", LocalDateTime.now());
//
//        if (!expiredSeats.isEmpty()) {
//            System.out.println("Cleaning up " + expiredSeats.size() + " expired seat locks...");
//        }
//
//        for (Seat seat : expiredSeats) {
//            seat.setStatus("AVAILABLE");
//            seat.setLockedByUserId(null);
//            seat.setLockExpiresAt(null);
//            seatRepository.save(seat);
//
//            // Gửi thông báo WebSocket đến tất cả client trong room của suất chiếu
//            messagingTemplate.convertAndSend("/topic/showtime/" + seat.getShowtimeId() + "/seats",
//                    new SeatStatusUpdate(seat.getId(), "AVAILABLE", null));
//        }
//    }
//}
