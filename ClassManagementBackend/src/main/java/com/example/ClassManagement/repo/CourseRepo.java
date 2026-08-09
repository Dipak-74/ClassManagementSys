package com.example.ClassManagement.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ClassManagement.DTO.CourseDTO;
import com.example.ClassManagement.entities.Course;

public interface CourseRepo extends JpaRepository<Course, Integer>{
	List<Course> findByownerid(int ownerid);
}
