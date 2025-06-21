package com.example.movie_booking.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResDTO {
    private String status; // OK, Failed
    private String message;
    private String url; // URL thanh toán của VNPAY
}