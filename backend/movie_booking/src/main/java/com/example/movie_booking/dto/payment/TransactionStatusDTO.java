package com.example.movie_booking.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
// (Response khi VNPAY trả về
public class TransactionStatusDTO {
    private String status;
    private String message;
    private String transactionId; // Mã giao dịch của VNPAY
    private String orderId;       // Mã đơn hàng của bạn
    private long amount;          // Số tiền đã thanh toán
}