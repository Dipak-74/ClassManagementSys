package com.example.ClassManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ClassManagement.DTO.CourseDTO;
import com.example.ClassManagement.DTO.CourseRespDTO;
import com.example.ClassManagement.services.CourseServicesImple;

@RestController
@RequestMapping("/course")
@CrossOrigin(origins  = "*")
public class CourseController {

		@Autowired
		CourseServicesImple imple;
		
		@PostMapping("/addcourse")
		String addcourse(@RequestBody CourseRespDTO dto) {
			return imple.addcourse(dto);
		}
		
		@GetMapping("/getmycourses/{ownerid}")
		List<CourseDTO> getmycourses(@RequestBody @PathVariable int ownerid){
			return imple.getmycourse(ownerid);
		}
		@GetMapping("/getallcourse")
		List<CourseRespDTO>getAllCourses(){
			return imple.getAllCourses();
		}
		
		@GetMapping("/getmybuycourses/{uid}")
		List<CourseRespDTO>getMyBuyCourses(@RequestBody @PathVariable int uid){
			return imple.getMyBuyCourses(uid);
		  }
}
