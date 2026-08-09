package com.example.ClassManagement.DTO;

import java.util.List;


public class UsersDTO {
	int uid;
	String name;
	String email;
	String password;
	String role;
	List<CourseRespDTO> courseRespDTO;
	public int getUid() {
		return uid;
	}
	public void setUid(int uid) {
		this.uid = uid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public List<CourseRespDTO> getCourseRespDTO() {
		return courseRespDTO;
	}
	public void setCourseRespDTO(List<CourseRespDTO> courseRespDTO) {
		this.courseRespDTO = courseRespDTO;
	}
	
	
	
}
