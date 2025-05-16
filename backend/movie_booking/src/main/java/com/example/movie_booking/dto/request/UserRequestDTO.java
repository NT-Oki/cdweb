package com.example.movie_booking.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class UserRequestDTO implements Serializable {
    private String email;
    private String password;
}
