package com.example.ClassManagement.services;


import java.util.List;

import org.apache.catalina.User;
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
		Users user = new Users();
		user.setName(dto.getName());
		user.setEmail(dto.getEmail());
		user.setPassword(dto.getPassword());
		user.setRole(dto.getRole());
		urepo.save(user);
		return "SucussFully Registed";
	}
	@Override
	public UserRespDTO login(loginDto dto) {
		Users user=urepo.findByEmail(dto.getEmail());
		UserRespDTO userRespDTO=new UserRespDTO();
		
			if(user==null) {
				return null;
			}
			
			if(!user.getPassword().equals(dto.getPassword())) {
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
			System.out.println(user.getName());
			Course course=crepo.findById(cid).orElse(null);
			List<Course> listcourse=user.getCourse();
			listcourse.add(course);
			urepo.save(user);
			System.out.println(user.getCourse());
			
		return "usercourse";
	}
	@Override
	public String deleteBuyCourse(int cid, int uid) {
		Users user=urepo.findById(uid).orElse(null);
		Course course=crepo.findById(cid).orElse(null);
		user.getCourse().remove(course);
		urepo.save(user);
		return "delete";
	}
	
	
}
