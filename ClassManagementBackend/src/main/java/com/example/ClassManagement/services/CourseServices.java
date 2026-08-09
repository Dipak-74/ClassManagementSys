package com.example.ClassManagement.services;

import java.util.List;

import com.example.ClassManagement.DTO.CourseDTO;
import com.example.ClassManagement.DTO.CourseRespDTO;

public interface CourseServices {
	String addcourse(CourseRespDTO dto);
	List<CourseDTO>getmycourse(int ownerid);
	List<CourseRespDTO>getAllCourses();
	List<CourseRespDTO>getMyBuyCourses(int uid);
}
