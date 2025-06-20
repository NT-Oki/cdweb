//package com.example.movie_booking.config;
//
//import com.stripe.Stripe;
//import jakarta.annotation.PostConstruct;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class StripeConfig {
//
//    @Value("${stripe.api.secret-key}")
//    private String secretKey;
//
//    @PostConstruct
//    public void init() {
//        // Đặt khóa bí mật của Stripe khi ứng dụng khởi động
//        Stripe.apiKey = secretKey;
//        System.out.println("Stripe API Key initialized."); // Để debug
//    }
//}