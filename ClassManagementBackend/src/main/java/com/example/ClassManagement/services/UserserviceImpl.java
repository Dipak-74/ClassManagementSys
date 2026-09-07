package com.example.ClassManagement.services;


import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ClassManagement.DTO.UserRespDTO;
import com.example.ClassManagement.DTO.UsersDTO;
import com.example.ClassManagement.DTO.loginDto;
import com.example.ClassManagement.entities.Course;
import com.example.ClassManagement.entities.Users;
import com.example.ClassManagement.repo.CourseRepo;
import com.example.ClassManagement.repo.UsersRepo;

@Service
public class UserserviceImpl implements UserServices {

	@Autowired
	UsersRepo urepo;
	@Autowired
	CourseRepo crepo;
	
	@Override
	public String addUsers(UsersDTO dto) {
		if (dto == null || isBlank(dto.getName()) || isBlank(dto.getEmail())
				|| isBlank(dto.getPassword()) || isBlank(dto.getRole())) {
			return "All fields are required";
		}
		String email = dto.getEmail().trim().toLowerCase();
		String role = dto.getRole().trim().toLowerCase();
		if (!email.contains("@")) {
			return "Enter a valid email";
		}
		if (dto.getPassword().trim().length() < 5) {
			return "Password must be at least 5 characters";
		}
		if (!role.equals("student") && !role.equals("teacher")) {
			return "Role must be student or teacher";
		}
		if (urepo.findByEmail(email) != null) {
			return "Email already registered";
		}
		Users user = new Users();
		user.setName(dto.getName().trim());
		user.setEmail(email);
		user.setPassword(dto.getPassword().trim());
		user.setRole(role);
		user.setCourse(new ArrayList<>());
		urepo.save(user);
		return "Successfully registered";
	}
	@Override
	public UserRespDTO login(loginDto dto) {
		if (dto == null || isBlank(dto.getEmail()) || isBlank(dto.getPassword())) {
			return null;
		}
		Users user=urepo.findByEmail(dto.getEmail().trim().toLowerCase());
		UserRespDTO userRespDTO=new UserRespDTO();
		
			if(user==null) {
				return null;
			}
			
			if(!user.getPassword().equals(dto.getPassword().trim())) {
				return null;
			}
			userRespDTO.setUid(user.getUid());
			userRespDTO.setName(user.getName());
			userRespDTO.setEmail(user.getEmail());
			userRespDTO.setRole(user.getRole());
			
		return userRespDTO;
	}
	
	@Override
	public String buycourse(int cid, int uid) {
			Users user=urepo.findById(uid).orElse(null);
			Course course=crepo.findById(cid).orElse(null);
			if (user == null || course == null) {
				return "User or course not found";
			}
			List<Course> listcourse=user.getCourse();
			if (listcourse == null) {
				listcourse = new ArrayList<>();
				user.setCourse(listcourse);
			}
			if (listcourse.contains(course)) {
				return "Course already purchased";
			}
			listcourse.add(course);
			urepo.save(user);
			
		return "usercourse";
	}
	@Override
	public String deleteBuyCourse(int cid, int uid) {
		Users user=urepo.findById(uid).orElse(null);
		Course course=crepo.findById(cid).orElse(null);
		if (user == null || course == null || user.getCourse() == null) {
			return "User or course not found";
		}
		user.getCourse().remove(course);
		urepo.save(user);
		return "delete";
	}

	private boolean isBlank(String value) {
		return value == null || value.trim().isEmpty();
	}
	
	
}
