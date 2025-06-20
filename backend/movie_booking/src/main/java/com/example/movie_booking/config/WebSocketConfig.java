package com.example.movie_booking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // Kích hoạt xử lý tin nhắn WebSocket với broker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Định nghĩa prefix cho các tin nhắn được gửi từ server đến client.
        // Client sẽ subscribe vào các địa chỉ bắt đầu bằng /topic hoặc /queue.
        config.enableSimpleBroker("/topic", "/queue");
        // Định nghĩa prefix cho các tin nhắn được gửi từ client đến server.
        // Các @MessageMapping controller sẽ lắng nghe các địa chỉ bắt đầu bằng /app.
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Đăng ký endpoint WebSocket mà client sẽ kết nối đến.
        // Client sẽ kết nối tới ws://localhost:8080/ws
        // .setAllowedOrigins("*") cho phép tất cả các origin (trong môi trường dev).
        // Trong production, bạn nên giới hạn các domain cụ thể.
        registry.addEndpoint("/ws")
                .addInterceptors(new AuthHandshakeInterceptor())
                .setAllowedOriginPatterns("*").withSockJS();
    }
}
