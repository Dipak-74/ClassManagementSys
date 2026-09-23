package com.example.ClassManagement.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ClassManagement.entities.Users;

public interface UsersRepo extends JpaRepository<Users, Integer>{
	Users findByEmail(String email);

	@Query("SELECT DISTINCT u FROM Users u LEFT JOIN FETCH u.course WHERE u.uid = :uid")
	Optional<Users> findByIdWithCourses(@Param("uid") int uid);
}
