package com.example.movie_booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.naming.Context;

@SpringBootApplication
@EnableScheduling
public class MovieBookingApplication {

	public static void main(String[] args) {
		ApplicationContext context= SpringApplication.run(MovieBookingApplication.class, args);

	}

}
