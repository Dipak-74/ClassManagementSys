package com.example.ClassManagement.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ClassManagement.entities.Course;

public interface CourseRepo extends JpaRepository<Course, Integer>{
	@Query("SELECT DISTINCT c FROM Course c LEFT JOIN FETCH c.users WHERE c.ownerid = :ownerid")
	List<Course> findByownerid(@Param("ownerid") int ownerid);
}
