package com.example.ClassManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ClassManagement.DTO.UserRespDTO;
import com.example.ClassManagement.DTO.UsersDTO;
import com.example.ClassManagement.DTO.loginDto;
import com.example.ClassManagement.services.UserserviceImpl;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://127.0.0.1:5500","http://localhost:5173"})
public class UserController {

		@Autowired
		UserserviceImpl impl;
		
		@PostMapping("/adduser")
		String addUsers(@RequestBody UsersDTO dto) {
			return impl.addUsers(dto);
		}
		@PostMapping("/login")
		UserRespDTO loginuser(@RequestBody loginDto dto) {
			return impl.login(dto);
		}
		@PostMapping("/buycourse/{cid}/{uid}")
		String buycourse(@RequestBody @PathVariable int cid, @PathVariable int uid ) {
			return impl.buycourse(cid, uid);
		}
		@DeleteMapping("/delete/{cid}/{uid}")
		String deleteBuyCourse(@RequestBody @PathVariable int cid,@PathVariable int uid) {
			return impl.deleteBuyCourse(cid,uid);
		}
		
}
