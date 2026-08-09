package com.example.ClassManagement.services;

import java.util.List;

import com.example.ClassManagement.DTO.UserRespDTO;
import com.example.ClassManagement.DTO.UsersDTO;
import com.example.ClassManagement.DTO.loginDto;

public interface UserServices{
	
		String addUsers(UsersDTO dto);
		UserRespDTO login(loginDto dto);
		String buycourse(int cid,int uid);
		String deleteBuyCourse(int cid,int uid);
}
