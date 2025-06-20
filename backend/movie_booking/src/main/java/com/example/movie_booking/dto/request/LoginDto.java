package com.example.movie_booking.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDto {
    @NotBlank(message = "validation.email.empty")
    @Email(message = "validation.email.invalid")
    private String email;

    @Size(min = 8, message = "validation.password.empty")
    @NotBlank(message = "validation.password.short")
    private String password;
}
