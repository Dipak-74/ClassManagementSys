package com.example.ClassManagement.services;

import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ClassManagement.DTO.UserRespDTO;
import com.example.ClassManagement.DTO.UsersDTO;
import com.example.ClassManagement.DTO.loginDto;
import com.example.ClassManagement.entities.Course;
import com.example.ClassManagement.entities.Users;
import com.example.ClassManagement.repo.CourseRepo;
import com.example.ClassManagement.repo.UsersRepo;

@Service
@Transactional
public class UserserviceImpl implements UserServices {

	@Autowired
	UsersRepo urepo;
	@Autowired
	CourseRepo crepo;
	@Autowired
	JdbcTemplate jdbcTemplate;
	
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
	@Transactional(readOnly = true)
	public UserRespDTO login(loginDto dto) {
		if (dto == null || isBlank(dto.getEmail()) || isBlank(dto.getPassword())) {
			return null;
		}
		Users user = urepo.findByEmail(dto.getEmail().trim().toLowerCase());
		if (user == null) {
			return null;
		}
		if (!user.getPassword().equals(dto.getPassword().trim())) {
			return null;
		}
		UserRespDTO userRespDTO = new UserRespDTO();
		userRespDTO.setUid(user.getUid());
		userRespDTO.setName(user.getName());
		userRespDTO.setEmail(user.getEmail());
		userRespDTO.setRole(user.getRole());
		return userRespDTO;
	}
	
	@Override
	public String buycourse(int cid, int uid) {
		try {
			Users user = urepo.findById(uid).orElse(null);
			Course course = crepo.findById(cid).orElse(null);
			if (user == null || course == null) {
				return "User or course not found";
			}

			// 1. Direct SQL check if already enrolled
			try {
				Integer count = jdbcTemplate.queryForObject(
					"SELECT COUNT(*) FROM user_course WHERE uid = ? AND cid = ?",
					Integer.class,
					uid, cid
				);
				if (count != null && count > 0) {
					return "Course already purchased";
				}
			} catch (Exception ex) {
				System.err.println("Notice: enrollment check: " + ex.getMessage());
			}

			// 2. Direct SQL insert (100% reliable in MySQL)
			boolean inserted = false;
			try {
				jdbcTemplate.update(
					"INSERT INTO user_course (uid, cid) VALUES (?, ?) ON DUPLICATE KEY UPDATE uid=uid",
					uid, cid
				);
				inserted = true;
			} catch (Exception ex) {
				try {
					jdbcTemplate.update("INSERT IGNORE INTO user_course (uid, cid) VALUES (?, ?)", uid, cid);
					inserted = true;
				} catch (Exception ex2) {
					System.err.println("Notice: SQL insert user_course: " + ex2.getMessage());
				}
			}

			// 3. Fallback JPA save if direct SQL did not run
			if (!inserted) {
				List<Course> listcourse = user.getCourse();
				if (listcourse == null) {
					listcourse = new ArrayList<>();
					user.setCourse(listcourse);
				}
				boolean alreadyBought = listcourse.stream().anyMatch(c -> c.getCid() == cid);
				if (alreadyBought) {
					return "Course already purchased";
				}
				listcourse.add(course);
				urepo.save(user);
			}

			return "Enrolled successfully";
		} catch (Exception e) {
			System.err.println("Error in buycourse: " + e.getMessage());
			return "Failed to enroll: " + e.getMessage();
		}
	}

	@Override
	public String deleteBuyCourse(int cid, int uid) {
		try {
			int rows = 0;
			try {
				rows = jdbcTemplate.update(
					"DELETE FROM user_course WHERE uid = ? AND cid = ?",
					uid, cid
				);
			} catch (Exception ex) {
				System.err.println("Notice: SQL delete user_course: " + ex.getMessage());
			}

			if (rows <= 0) {
				Users user = urepo.findById(uid).orElse(null);
				if (user != null && user.getCourse() != null) {
					user.getCourse().removeIf(c -> c.getCid() == cid);
					urepo.save(user);
				}
			}
			return "Unenrolled successfully";
		} catch (Exception e) {
			System.err.println("Error in deleteBuyCourse: " + e.getMessage());
			return "Failed to drop course: " + e.getMessage();
		}
	}

	private boolean isBlank(String value) {
		return value == null || value.trim().isEmpty();
	}
}
