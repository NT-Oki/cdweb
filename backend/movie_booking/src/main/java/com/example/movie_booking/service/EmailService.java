package com.example.movie_booking.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public JavaMailSender getMailSender() {
        return mailSender;
    }

    public void sendWelcomeEmail(String to, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Chào mừng bạn đến với Movie Booking!");

            String emailContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>"
                    + "<h2 style='color: #e50914; text-align: center;'>Chào mừng bạn đến với Movie Booking!</h2>"
                    + "<p>Kính gửi " + name + ",</p>"
                    + "<p>Cảm ơn bạn đã đăng ký tài khoản tại hệ thống đặt vé xem phim của chúng tôi.</p>"
                    + "<p>Thông tin tài khoản của bạn:</p>"
                    + "<ul>"
                    + "<li><strong>Email:</strong> " + to + "</li>"
                    + "<li><strong>Họ tên:</strong> " + name + "</li>"
                    + "</ul>"
                    + "<p>Bạn có thể đăng nhập ngay để khám phá các bộ phim hấp dẫn và đặt vé dễ dàng.</p>"
                    + "<p style='text-align: center; margin: 20px 0;'>"
                    + "<a href='http://localhost:5173/login' style='background-color: #e50914; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Đăng nhập ngay</a>"
                    + "</p>"
                    + "<p>Nếu bạn có thắc mắc, vui lòng liên hệ qua email <a href='mailto:support@moviebooking.com'>support@moviebooking.com</a>.</p>"
                    + "<p style='margin-top: 20px; color: #7f8c8d;'>Trân trọng,<br/>Đội ngũ Movie Booking</p>"
                    + "</div>";

            helper.setText(emailContent, true);
            mailSender.send(message);
        } catch (MessagingException | MailException e) {
            throw new RuntimeException("Lỗi khi gửi email chào mừng: " + e.getMessage());
        }
    }

    public void sendVerificationEmail(String to, String name, String verificationCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Xác minh tài khoản Movie Booking");

            String verificationLink = "http://localhost:5173/verify-email?code=" + verificationCode;
            String emailContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>"
                    + "<h2 style='color: #e50914; text-align: center;'>Xác minh tài khoản Movie Booking</h2>"
                    + "<p>Kính gửi " + name + ",</p>"
                    + "<p>Cảm ơn bạn đã đăng ký tài khoản tại hệ thống đặt vé xem phim của chúng tôi.</p>"
                    + "<p>Vui lòng nhấn vào nút dưới đây để xác minh email của bạn:</p>"
                    + "<p style='text-align: center; margin: 20px 0;'>"
                    + "<a href='" + verificationLink + "' style='background-color: #e50914; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Xác minh email</a>"
                    + "</p>"
                    + "<p>Nếu nút không hoạt động, bạn có thể sao chép và dán link sau vào trình duyệt:</p>"
                    + "<p><a href='" + verificationLink + "'>" + verificationLink + "</a></p>"
                    + "<p>Link này sẽ hết hạn sau 24 giờ.</p>"
                    + "<p>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email.</p>"
                    + "<p style='margin-top: 20px; color: #7f8c8d;'>Trân trọng,<br/>Đội ngũ Movie Booking</p>"
                    + "</div>";

            helper.setText(emailContent, true);
            mailSender.send(message);
        } catch (MessagingException | MailException e) {
            throw new RuntimeException("Lỗi khi gửi email xác minh: " + e.getMessage());
        }
    }
}