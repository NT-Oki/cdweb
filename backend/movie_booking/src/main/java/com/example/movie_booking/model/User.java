package com.example.movie_booking.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity
//@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;

    private String name;

    private String cardId;

    private String email;
    private String password;

    private boolean gender;

    private boolean status;

    private String phoneNumber;
    private String avatar;
    private String address;
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

}
