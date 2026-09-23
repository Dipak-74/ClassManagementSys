package com.example.ClassManagement;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class ClassManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClassManagementApplication.class, args);
		System.out.println("server running mode");
	}

	@Bean
	public CommandLineRunner initDatabase(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute(
					"CREATE TABLE IF NOT EXISTS user_course (" +
					"uid INT NOT NULL, " +
					"cid INT NOT NULL, " +
					"PRIMARY KEY (uid, cid)" +
					")"
				);
				System.out.println("Database table user_course verified/created successfully.");
			} catch (Exception e) {
				System.err.println("Database init notice: " + e.getMessage());
			}
		};
	}
}
