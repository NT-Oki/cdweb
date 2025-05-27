package com.example.movie_booking.controller.admin;

import jakarta.validation.Valid;
import com.example.movie_booking.dto.AdminRegisterDto;
import com.example.movie_booking.model.User;
import com.example.movie_booking.service.IUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
public class UserManagerController {
    private final IUserService userService;

    public UserManagerController(IUserService userService) {
        this.userService = userService;
    }

    // Lấy danh sách user trả về JSON
    @GetMapping("/list")
    public ResponseEntity<List<User>> list() {
        List<User> members = userService.findAllMembers();
        return ResponseEntity.ok(members);
    }

    // Thêm user mới
    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody AdminRegisterDto form, BindingResult result, @RequestParam String type) {
        Map<String, String> errors = new HashMap<>();

        if (!form.getPassword().equals(form.getConfirmPassword())) {
            errors.put("confirmPassword", "Mật khẩu không tương ứng. Thử lại.");
        }

        if (userService.findByEmail(form.getEmail().trim().toLowerCase()) != null) {
            errors.put("email", "Email này đã có người đăng ký. Thử lại.");
        }

        if (result.hasErrors()) {
            result.getFieldErrors().forEach(err ->
                    errors.put(err.getField(), err.getDefaultMessage())
            );
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

//        String role = "ROLE_USER";
        User user = userService.convertToUser(form);
        userService.save(user);

        Map<String, String> successData = new HashMap<>();
        successData.put("message", "Đăng ký thành công!");
        successData.put("fullName", form.getName());
        successData.put("email", form.getEmail());

        return ResponseEntity.status(HttpStatus.CREATED).body(successData);
    }

    // Xóa user theo id (dùng DELETE là đúng RESTful)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long userId) {
        Map<String, String> errors = new HashMap<>();
        User user = userService.findById(userId);

        if (user == null) {
            errors.put("id", "Không tìm thấy Người dùng muốn xóa");
            return ResponseEntity.badRequest().body(errors);
        }

        userService.delete(user);

        Map<String, String> successData = new HashMap<>();
        successData.put("message", "Xóa thành công!");
        return ResponseEntity.ok(successData);
    }

    // Xem chi tiết user theo id
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable("id") Long userId) {
        User user = userService.findById(userId);

        if (user == null) {
            Map<String, String> errors = new HashMap<>();
            errors.put("id", "Không tìm thấy Người dùng");
            return ResponseEntity.badRequest().body(errors);
        }

        // Trả về user dưới dạng JSON
        return ResponseEntity.ok(user);
    }

}
