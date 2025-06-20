package com.example.movie_booking.controller.admin;

import com.example.movie_booking.service.UserService;
import jakarta.validation.Valid;
import com.example.movie_booking.dto.AdminRegisterDto;
import com.example.movie_booking.model.User;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public ResponseEntity<List<User>> list() {
        List<User> members = userService.findAllMembers();
        return ResponseEntity.ok(members);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody AdminRegisterDto form, BindingResult result) {
        Map<String, String> errors = new HashMap<>();

        // Kiểm tra password và confirmPassword khi thêm mới (id == null)
        if (form.getId() == null) {
            if (form.getPassword() == null || form.getPassword().isEmpty()) {
                errors.put("password", "Mật khẩu không được để trống khi thêm mới");
            } else if (!form.getPassword().equals(form.getConfirmPassword())) {
                errors.put("confirmPassword", "Mật khẩu không tương ứng. Thử lại.");
            }
        }

        // Kiểm tra email trùng
        User existingUser = userService.findByEmail(form.getEmail().trim().toLowerCase());
        if (existingUser != null && (form.getId() == null || !existingUser.getId().equals(form.getId()))) {
            errors.put("email", "Email này đã có người đăng ký. Thử lại.");
        }

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            result.getFieldErrors().forEach(err ->
                    errors.put(err.getField(), err.getDefaultMessage())
            );
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            User savedUser = userService.save(form);
            Map<String, String> successData = new HashMap<>();
            successData.put("message", form.getId() == null ? "Đăng ký thành công!" : "Cập nhật thành công!");
            successData.put("fullName", savedUser.getName());
            successData.put("email", savedUser.getEmail());
            return ResponseEntity.status(form.getId() == null ? HttpStatus.CREATED : HttpStatus.OK).body(successData);
        } catch (IllegalArgumentException e) {
            errors.put("role", e.getMessage());
            return ResponseEntity.badRequest().body(errors);
        }
    }

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

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<?> deleteMultiple(@RequestBody List<Long> userIds) {
        Map<String, Object> response = new HashMap<>();
        if (userIds == null || userIds.isEmpty()) {
            response.put("error", "Danh sách người dùng cần xóa không được để trống.");
            return ResponseEntity.badRequest().body(response);
        }
        int deletedCount = 0;
        int notFoundCount = 0;
        for (Long id : userIds) {
            User user = userService.findById(id);
            if (user != null) {
                userService.delete(user);
                deletedCount++;
            } else {
                notFoundCount++;
            }
        }
        response.put("deleted", deletedCount);
        if (notFoundCount > 0) {
            response.put("notFound", notFoundCount);
            response.put("message", "Một số người dùng không tìm thấy.");
        } else {
            response.put("message", "Xóa thành công tất cả người dùng.");
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable("id") Long userId) {
        User user = userService.findById(userId);

        if (user == null) {
            Map<String, String> errors = new HashMap<>();
            errors.put("id", "Không tìm thấy Người dùng");
            return ResponseEntity.badRequest().body(errors);
        }

        return ResponseEntity.ok(user);
    }
}