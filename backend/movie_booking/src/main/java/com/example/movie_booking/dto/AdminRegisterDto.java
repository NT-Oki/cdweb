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

    @NotBlank(message = "validation.email.empty")
    @Email(message = "validation.email.invalid")
    private String email;

    private String password;

    private String confirmPassword;

    @NotBlank(message = "validation.name.empty")
    private String name;

    private String cardId;

    @Pattern(regexp = "^(0[0-9]{9})$", message = "validation.phone.invalid")
    private String phoneNumber;

    private boolean gender; // true = nam, false = nữ

    private String address;

    private String avatar; // Có thể null hoặc client upload sau

    @NotBlank(message = "validation.role.empty")
    private String role;
}
