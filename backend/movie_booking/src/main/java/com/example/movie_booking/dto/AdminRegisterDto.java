package com.example.movie_booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminRegisterDto {

    private Long id;
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    private String password;

    private String confirmPassword;

    @NotBlank(message = "Họ tên không được để trống")
    private String name;

    private String cardId;

    @Pattern(regexp = "^(0[0-9]{9})$", message = "Số điện thoại không hợp lệ (phải có 10 chữ số, bắt đầu bằng 0)")
    private String phoneNumber;

    private boolean gender; // true = nam, false = nữ

    private String address;

    private String avatar; // Có thể null hoặc client upload sau

    @NotBlank(message = "Email không được để trống")
    private String role;
}
