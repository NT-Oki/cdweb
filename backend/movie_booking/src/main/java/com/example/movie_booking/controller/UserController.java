package com.example.movie_booking.controller;

import com.example.movie_booking.service.UserService;
import jakarta.validation.Valid;
import com.example.movie_booking.dto.RegisterDto;
import com.example.movie_booking.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto form, BindingResult result) {
        Map<String, String> errors = new HashMap<>();

        // Kiểm tra xác nhận mật khẩu
        if (!form.getPassword().equals(form.getConfirmPassword())) {
            errors.put("confirmPassword", "Mật khẩu không tương ứng. Thử lại.");
        }

        // Kiểm tra email tồn tại
        if (userService.findByEmail(form.getEmail().trim().toLowerCase()) != null) {
            errors.put("email", "Email này đã có người đăng ký. Thử lại.");
        }

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            result.getFieldErrors().forEach(err ->
                    errors.put(err.getField(), err.getDefaultMessage())
            );
        }

        // Nếu có lỗi, trả về mã lỗi 400 và danh sách lỗi
        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }
        String role = "ROLE_USER";
        User user = userService.convertToUser(form, role);
        userService.save(user);

        // Trả lại thông tin đăng ký thành công (dưới dạng JSON)
        Map<String, String> successData = new HashMap<>();
        successData.put("message", "Đăng ký thành công!");
        successData.put("fullName", form.getName());
        successData.put("email", form.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(successData);
    }
}
