//package com.example.movie_booking.service;
//
//import com.example.movie_booking.dto.payment.PaymentRequestDTO;
//import com.stripe.exception.StripeException;
//import com.stripe.model.PaymentIntent;
//import com.stripe.param.PaymentIntentCreateParams;
//import org.springframework.stereotype.Service;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//public class StripePaymentService {
//
//    public PaymentIntent createAndConfirmPayment(PaymentRequestDTO request) throws StripeException {
//        // Tạo metadata để lưu thông tin đơn hàng vào PaymentIntent của Stripe
//        Map<String, Object> metadata = new HashMap<>();
//        metadata.put("order_id", request.getOrderId());
//        metadata.put("movie_title", request.getMovieTitle());
//        metadata.put("number_of_tickets", request.getNumberOfTickets());
//
//        PaymentIntentCreateParams createParams = PaymentIntentCreateParams.builder()
//                .setAmount(request.getAmount())
//                .setCurrency(request.getCurrency())
//                .setPaymentMethod(request.getPaymentMethodId()) // Sử dụng ID phương thức thanh toán từ frontend
//                .setConfirm(true) // Tự động xác nhận giao dịch ngay lập tức
//                .setReturnUrl("http://localhost:8080/payment/confirm") // URL mà Stripe sẽ redirect về sau 3D Secure (nếu có)
//                .putAllMetadata(metadata) // Thêm metadata
//                .build();
//
//        return PaymentIntent.create(createParams);
//    }
//
//    // Bạn có thể thêm các phương thức khác như:
//    // - retrievePaymentIntent(String paymentIntentId): để lấy thông tin chi tiết của một PaymentIntent
//    // - refundPayment(String paymentIntentId, Long amount): để hoàn tiền
//}
