package com.example.movie_booking.controller;

import com.example.movie_booking.config.VnPayConfig;
import com.example.movie_booking.dto.payment.PaymentResDTO;
import com.example.movie_booking.dto.payment.TransactionStatusDTO;
import com.example.movie_booking.model.Booking;
import com.example.movie_booking.model.BookingSeat;
import com.example.movie_booking.model.BookingStatus;
import com.example.movie_booking.model.ShowTimeSeat;
import com.example.movie_booking.repository.IBookingRepository;
import com.example.movie_booking.repository.IBookingSeatRepository;
import com.example.movie_booking.repository.IBookingStatusRepository;
import com.example.movie_booking.repository.IShowTimeSeatRepository;
import com.example.movie_booking.util.CodeGenerator;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("booking/payment")
public class PaymentController {
    @Autowired
    IBookingRepository bookingRepository;
    @Autowired
    IBookingStatusRepository statusRepository;
    @Autowired
    IShowTimeSeatRepository showtimeSeatRepository;
    @Autowired
    IBookingSeatRepository bookingSeatRepository;
    @Autowired
    private VnPayConfig vnPayConfig;

    @GetMapping("/create_payment")
    public ResponseEntity<PaymentResDTO> createPayment(@RequestParam long amount,@RequestParam long bookingId, HttpServletRequest request) {
        try {
            Booking booking=bookingRepository.findById(bookingId).get();

            // Lấy IP address của client
            String vnp_IpAddr = request.getRemoteAddr();
            String orderId = vnPayConfig.getOrderId(); // Tạo mã đơn hàng duy nhất của bạn
            booking.setPaymentId(orderId);
            bookingRepository.save(booking);
            // Tạo URL thanh toán VNPAY
            String vnp_PaymentUrl = new VnPayConfig.Builder(vnPayConfig)
                    .withTxnRef(orderId)
                    .withAmount(amount)
                    .withOrderInfo("Thanh toan don hang: " + orderId)
                    .withOrderType("billpayment") // Có thể thay đổi loại đơn hàng
                    .withLocale("vn") // "vn" hoặc "en"
                    .withBankCode("NCB")
                    .buildPaymentUrl();

            return ResponseEntity.ok(new PaymentResDTO("OK", "Success", vnp_PaymentUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new PaymentResDTO("Failed", "Error creating payment URL", null));
        }
    }

    @GetMapping("/vnpay_return")
    public ResponseEntity<TransactionStatusDTO> vnPayReturn(HttpServletRequest request) {
        Map<String, String> vnp_Params = new HashMap<>();
        Enumeration<String> params = request.getParameterNames();

        while (params.hasMoreElements()) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                vnp_Params.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (vnp_Params.containsKey("vnp_SecureHashType")) {
            vnp_Params.remove("vnp_SecureHashType");
        }
        if (vnp_Params.containsKey("vnp_SecureHash")) {
            vnp_Params.remove("vnp_SecureHash");
        }

        // Kiểm tra checksum
        String signValue = vnPayConfig.hmacSHA512(vnPayConfig.getHashSecret(), buildHashData(vnp_Params));

        TransactionStatusDTO response = new TransactionStatusDTO();
        Booking booking = null;
        Long movieId=null;
        if (signValue.equals(vnp_SecureHash)) {
            // Check success or failure
            String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
            String transactionId = request.getParameter("vnp_TransactionNo");
            String orderId = request.getParameter("vnp_TxnRef");

            long amount = Long.parseLong(request.getParameter("vnp_Amount")) / 100; // Chia lại cho 100

            response.setTransactionId(transactionId);
            response.setOrderId(orderId);
            response.setAmount(amount);
            booking = bookingRepository.findByPaymentId(orderId);
            movieId=booking.getShowTime().getMovie().getId();
            if ("00".equals(vnp_ResponseCode)) {
                response.setStatus("OK");
                response.setMessage("Giao dịch thành công");
                BookingStatus bookingStatus = statusRepository.findById(2L).orElse(null);
                booking.setBookingStatus(bookingStatus);
                booking.setCodeBooking(CodeGenerator.generateBookingCode());
                bookingRepository.save(booking);
                return ResponseEntity.status(HttpStatus.FOUND).header("Location", "http://localhost:5173/ticket?bookingId=" + booking.getId()).build();

            } else {
                response.setStatus("Failed");
                response.setMessage("Giao dịch thất bại. Mã lỗi VNPAY: " + vnp_ResponseCode);


            }
        } else {
            response.setStatus("Failed");
            response.setMessage("Chữ ký không hợp lệ");

        }
        List<ShowTimeSeat>showTimeSeats=showtimeSeatRepository.findByBookingId(booking.getId());
        for(ShowTimeSeat showTimeSeat:showTimeSeats){
            showTimeSeat.setStatus(0);
            showTimeSeat.setLocked_by_user_id(0L);
            showTimeSeat.setLockedAt(null);
        }
        showtimeSeatRepository.saveAll(showTimeSeats);
        bookingSeatRepository.deleteByBookingId(booking.getId());
        bookingRepository.delete(booking);
        return ResponseEntity.status(HttpStatus.FOUND).header("Location", "http://localhost:5173/movie/" + movieId).build();
    }

    private String buildHashData(Map<String, String> vnp_Params) {
        // Build hash data from parameters (sorted by key, url encoded)
        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                try {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException("Encoding not supported", e);
                }
            }
        }
        return hashData.toString();
    }
}