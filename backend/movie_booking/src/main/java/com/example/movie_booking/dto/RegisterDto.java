package com.example.movie_booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDto {

    @NotBlank(message = "validation.email.empty")
    @Email(message = "validation.email.invalid")
    private String email;

    @NotBlank(message = "validation.password.empty")
    @Size(min = 8, message = "validation.password.short")
    private String password;

    @NotBlank(message = "validation.confirmPassword")
    private String confirmPassword;

    @NotBlank(message = "validation.name.empty")
    private String name;

    private String cardId;

    @Pattern(regexp = "^(0[0-9]{9})$", message = "validation.phone.invalid")
    @NotBlank(message = "validation.phone.empty")
    private String phoneNumber;

    private boolean gender; // true = nam, false = nữ

    private String address;

    private String avatar; // Có thể null hoặc client upload sau
}
