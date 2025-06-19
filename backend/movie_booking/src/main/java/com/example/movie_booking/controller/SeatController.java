//package com.example.movie_booking.controller;
//
//import com.example.movie_booking.dto.booking.SeatRequest;
//import com.example.movie_booking.model.Seat;
//import com.example.movie_booking.service.SeatService;
//import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.handler.annotation.DestinationVariable;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.Payload;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.time.LocalDateTime;
//import java.util.Optional;
//import java.util.concurrent.ConcurrentHashMap;
//import java.util.concurrent.Executors;
//import java.util.concurrent.ScheduledExecutorService;
//import java.util.concurrent.ScheduledFuture;
//
//@RestController
//public class SeatController {
//    @Autowired
//    SeatService seatService;
//    @Autowired
//    private SimpMessagingTemplate messagingTemplate;
//    // Giả sử có một lớp SeatRequest và SeatStatusUpdate DTO
//    // public class SeatRequest { private Long showtimeId; private Long seatId; private Long userId; }
//    // public class SeatStatusUpdate { private Long seatId; private String newStatus; private Long userId; }
//
//    // Map để lưu trữ các Future cho việc giải phóng ghế tự động
//    // Key: showtimeId_seatId_userId (để tránh xung đột nếu user khác cố gắng khóa cùng ghế)
//    private final ConcurrentHashMap<String, ScheduledFuture<?>> seatLockFutures = new ConcurrentHashMap<>();
//    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(10); // Pool cho các tác vụ giải phóng ghế
//    // Thời gian khóa ghế mặc định (phút)
//    private static final long LOCK_DURATION_MINUTES = 5; // 5 phút
//    ////////////chọn seat
//
//    // Endpoint WebSocket để client tham gia room của suất chiếu
//    @MessageMapping("/join/{showtimeId}")
//    public void joinShowtimeRoom(@DestinationVariable Long showtimeId) {
//        // Khi client join, có thể gửi lại trạng thái hiện tại của tất cả ghế trong suất chiếu đó
//        // Hoặc chỉ đơn giản là xác nhận join thành công.
//        System.out.println("Client joined showtime room: " + showtimeId);
//    }
//
//    @MessageMapping("/selectSeat") // Client gửi tin nhắn đến /app/selectSeat
//    @Transactional // Đảm bảo giao dịch database
//    public void selectSeat(@Payload SeatRequest request) {
//        Long showtimeId = request.getShowtimeId();
//        Long seatId = request.getSeatId();
//        Long userId = request.getUserId(); // ID của người dùng thực hiện chọn ghế
//
//        // Tìm ghế trong DB (Bạn cần một entity Seat và SeatRepository)
//        Optional<Seat> optionalSeat = seatRepository.findByShowtimeIdAndSeatId(showtimeId, seatId);
//
//        if (optionalSeat.isEmpty()) {
//            // Ghế không tồn tại, thông báo lỗi cho người dùng cụ thể
//            messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/errors",
//                    "Seat " + seatId + " does not exist.");
//            return;
//        }
//
//        Seat seat = optionalSeat.get();
//
//        // Logic khóa ghế
//        if (seat.getStatus()==0) {
//            seat.setStatus(2);
//            seat.setLockedByUser(userId);
//            LocalDateTime lockExpiresAt = LocalDateTime.now().plusMinutes(5); // Khóa 5 phút
//            seat.setLockExpiresAt(lockExpiresAt);
//            seatRepository.save(seat);
//
//            // Hủy bỏ tác vụ giải phóng khóa cũ nếu có (ví dụ, user chọn lại)
//            String lockKey = generateLockKey(showtimeId, seatId, userId);
//            if (seatLockFutures.containsKey(lockKey)) {
//                seatLockFutures.get(lockKey).cancel(true);
//            }
//
//            // Lên lịch giải phóng khóa tự động
//            ScheduledFuture<?> future = scheduler.schedule(() -> {
//                releaseSeatLock(showtimeId, seatId, userId); // Giải phóng khóa nếu hết thời gian
//                seatLockFutures.remove(lockKey); // Xóa khỏi map sau khi tác vụ hoàn thành
//            }, 5, TimeUnit.MINUTES);
//            seatLockFutures.put(lockKey, future);
//
//            // Gửi thông báo cập nhật trạng thái ghế đến TẤT CẢ client trong room của suất chiếu
//            messagingTemplate.convertAndSend("/topic/showtime/" + showtimeId + "/seats",
//                    new SeatStatusUpdate(seatId, "LOCKED", userId));
//
//            // Thông báo thành công cho người dùng đã chọn ghế
//            messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/seat-selection-success",
//                    "Seat " + seatId + " locked successfully.");
//
//        } else if (seat.getStatus().equals("LOCKED") && seat.getLockedByUserId().equals(userId)) {
//            // Người dùng chọn lại ghế của chính họ: gia hạn khóa
//            LocalDateTime lockExpiresAt = LocalDateTime.now().plusMinutes(5);
//            seat.setLockExpiresAt(lockExpiresAt);
//            seatRepository.save(seat);
//
//            // Hủy bỏ tác vụ giải phóng khóa cũ và tạo tác vụ mới với thời gian gia hạn
//            String lockKey = generateLockKey(showtimeId, seatId, userId);
//            if (seatLockFutures.containsKey(lockKey)) {
//                seatLockFutures.get(lockKey).cancel(true);
//            }
//            ScheduledFuture<?> future = scheduler.schedule(() -> {
//                releaseSeatLock(showtimeId, seatId, userId);
//                seatLockFutures.remove(lockKey);
//            }, 5, TimeUnit.MINUTES);
//            seatLockFutures.put(lockKey, future);
//
//            // Có thể gửi lại trạng thái cập nhật cho chính user đó nếu cần
//            messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/seat-selection-success",
//                    "Seat " + seatId + " lock extended.");
//
//        } else {
//            // Ghế đã LOCKED bởi người khác hoặc SOLD
//            messagingTemplate.convertAndSendToUser(userId.toString(), "/queue/errors",
//                    "Seat " + seatId + " is not available.");
//        }
//    }
//    @MessageMapping("/releaseSeat") // Client gửi tin nhắn đến /app/releaseSeat
//    @Transactional
//    public void releaseSeat(@Payload SeatRequest request) {
//        Long showtimeId = request.getShowtimeId();
//        Long seatId = request.getSeatId();
//        Long userId = request.getUserId();
//
//        releaseSeatLock(showtimeId, seatId, userId);
//    }
//
//    // Phương thức nội bộ để giải phóng khóa ghế
//    private void releaseSeatLock(Long showtimeId, Long seatId, Long userId) {
//        Optional<Seat> optionalSeat = seatRepository.findByShowtimeIdAndSeatId(showtimeId, seatId);
//        if (optionalSeat.isPresent()) {
//            Seat seat = optionalSeat.get();
//            // Chỉ giải phóng nếu nó đang bị khóa bởi người dùng này
//            if (seat.getStatus().equals("LOCKED") && seat.getLockedByUserId() != null && seat.getLockedByUserId().equals(userId)) {
//                seat.setStatus("AVAILABLE");
//                seat.setLockedByUserId(null);
//                seat.setLockExpiresAt(null);
//                seatRepository.save(seat);
//
//                // Hủy tác vụ giải phóng khóa tự động nếu có
//                String lockKey = generateLockKey(showtimeId, seatId, userId);
//                if (seatLockFutures.containsKey(lockKey)) {
//                    seatLockFutures.get(lockKey).cancel(true);
//                    seatLockFutures.remove(lockKey);
//                }
//
//                // Gửi thông báo cập nhật trạng thái ghế đến TẤT CẢ client
//                messagingTemplate.convertAndSend("/topic/showtime/" + showtimeId + "/seats",
//                        new SeatStatusUpdate(seatId, "AVAILABLE", null));
//            }
//        }
//    }
//
//    // Hỗ trợ tạo key cho map lock futures
//    private String generateLockKey(Long showtimeId, Long seatId, Long userId) {
//        return String.format("%d_%d_%d", showtimeId, seatId, userId);
//    }
//
//    // Logic xử lý khi thanh toán thành công (có thể là một REST endpoint riêng)
//    @Transactional
//    public void handlePaymentSuccess(Long showtimeId, Long seatId, Long userId) {
//        Optional<Seat> optionalSeat = seatRepository.findByShowtimeIdAndSeatId(showtimeId, seatId);
//        if (optionalSeat.isPresent()) {
//            Seat seat = optionalSeat.get();
//            // Đảm bảo ghế đang bị khóa bởi người dùng này trước khi chuyển sang SOLD
//            if (seat.getStatus().equals("LOCKED") && seat.getLockedByUserId() != null && seat.getLockedByUserId().equals(userId)) {
//                seat.setStatus("SOLD");
//                seat.setLockedByUserId(null);
//                seat.setLockExpiresAt(null);
//                seatRepository.save(seat);
//
//                // Hủy tác vụ giải phóng khóa tự động
//                String lockKey = generateLockKey(showtimeId, seatId, userId);
//                if (seatLockFutures.containsKey(lockKey)) {
//                    seatLockFutures.get(lockKey).cancel(true);
//                    seatLockFutures.remove(lockKey);
//                }
//
//                // Gửi thông báo cập nhật trạng thái ghế đến TẤT CẢ client
//                messagingTemplate.convertAndSend("/topic/showtime/" + showtimeId + "/seats",
//                        new SeatStatusUpdate(seatId, "SOLD", null));
//            }
//        }
//    }
//
//}
