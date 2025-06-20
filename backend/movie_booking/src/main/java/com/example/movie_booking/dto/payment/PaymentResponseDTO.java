package com.example.movie_booking.dto.payment;

import lombok.Data;

@Data
public class PaymentResponseDTO {
    private String clientSecret; // Client Secret của PaymentIntent (Stripe)
    private String status;       // Trạng thái thanh toán (ví dụ: "requires_action", "succeeded", "failed")
    private String message;      // Thông báo lỗi nếu có
}
