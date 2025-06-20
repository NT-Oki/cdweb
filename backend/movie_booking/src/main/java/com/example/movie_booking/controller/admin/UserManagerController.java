package com.example.movie_booking.controller.admin;

import com.example.movie_booking.service.UserService;
import jakarta.validation.Valid;
import com.example.movie_booking.dto.AdminRegisterDto;
import com.example.movie_booking.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.Locale;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
public class UserManagerController {
    @Autowired
    private UserService userService;

    @Autowired
    MessageSource messageSource;

    @GetMapping("/list")
    public ResponseEntity<List<User>> list() {
        List<User> members = userService.findAllMembers();
        return ResponseEntity.ok(members);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@Valid @RequestBody AdminRegisterDto form, BindingResult result, Locale locale) {
        Map<String, String> errors = new HashMap<>();

        // Kiểm tra password và confirmPassword khi thêm mới (id == null)
        if (form.getId() == null) {
            if (form.getPassword() == null || form.getPassword().isEmpty()) {
                errors.put("password", messageSource.getMessage("user.password.empty", null, locale));
            } else if (!form.getPassword().equals(form.getConfirmPassword())) {
                errors.put("confirmPassword", messageSource.getMessage("user.password.mismatch", null, locale));
            }
        }

        // Kiểm tra email trùng
        User existingUser = userService.findByEmail(form.getEmail().trim().toLowerCase());
        if (existingUser != null && (form.getId() == null || !existingUser.getId().equals(form.getId()))) {
            errors.put("email", messageSource.getMessage("user.email.exists", null, locale));
        }

        // Kiểm tra lỗi validation
        if (result.hasErrors()) {
            result.getFieldErrors().forEach(err ->
                    errors.put(err.getField(), messageSource.getMessage(err.getDefaultMessage(), null, locale))
            );
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            User savedUser = userService.save(form, locale);
            Map<String, String> successData = new HashMap<>();
            successData.put("message", messageSource.getMessage(
                    form.getId() == null ? "user.add.success" : "user.update.success", null, locale));
            successData.put("fullName", savedUser.getName());
            successData.put("email", savedUser.getEmail());
            return ResponseEntity.status(form.getId() == null ? HttpStatus.CREATED : HttpStatus.OK).body(successData);
        } catch (IllegalArgumentException e) {
            errors.put("message", messageSource.getMessage("user.role.invalid", new Object[]{e.getMessage()}, locale));
            return ResponseEntity.badRequest().body(errors);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long userId, Locale locale) {
        Map<String, String> errors = new HashMap<>();
        User user = userService.findById(userId);

        if (user == null) {
            errors.put("message", messageSource.getMessage("user.notfound", null, locale));
            return ResponseEntity.badRequest().body(errors);
        }

        userService.delete(user);

        Map<String, String> successData = new HashMap<>();
        successData.put("message", messageSource.getMessage("user.delete.success", null, locale));
        return ResponseEntity.ok(successData);
    }

    @DeleteMapping("/delete-multiple")
    public ResponseEntity<?> deleteMultiple(@RequestBody List<Long> userIds, Locale locale) {
        Map<String, Object> response = new HashMap<>();
        if (userIds == null || userIds.isEmpty()) {
            response.put("error", messageSource.getMessage("user.delete.multiple.empty", null, locale));
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
            response.put("message", messageSource.getMessage("user.delete.multiple.partial", new Object[]{deletedCount, notFoundCount}, locale));
        } else {
            response.put("message", messageSource.getMessage("user.delete.multiple.success", new Object[]{deletedCount}, locale));
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable("id") Long userId, Locale locale) {
        User user = userService.findById(userId);

        if (user == null) {
            Map<String, String> errors = new HashMap<>();
            errors.put("id", messageSource.getMessage("user.notfound", null, locale));
            return ResponseEntity.badRequest().body(errors);
        }

        return ResponseEntity.ok(user);
    }
}