package com.example.ClassManagement.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.ClassManagement.DTO.CourseDTO;
import com.example.ClassManagement.DTO.CourseRespDTO;
import com.example.ClassManagement.DTO.UserRespDTO;
import com.example.ClassManagement.entities.Course;
import com.example.ClassManagement.entities.Users;
import com.example.ClassManagement.repo.CourseRepo;
import com.example.ClassManagement.repo.UsersRepo;

@Service
@Transactional
public class CourseServicesImple implements CourseServices{

	@Autowired
	CourseRepo crepo;
	@Autowired
	UsersRepo urepo;
	@Autowired
	JdbcTemplate jdbcTemplate;

	private String resolveTeacherName(int ownerid, Map<Integer, String> cache) {
		return cache.computeIfAbsent(ownerid, id -> {
			try {
				Users u = urepo.findById(id).orElse(null);
				return (u != null && u.getName() != null && !u.getName().trim().isEmpty())
						? u.getName().trim() : "Teacher #" + id;
			} catch (Exception ex) {
				return "Teacher #" + id;
			}
		});
	}

	@Override
	public String addcourse(CourseRespDTO dto) {
		if (dto == null || dto.getCname() == null || dto.getCname().trim().isEmpty()) {
			return "Course name cannot be empty";
		}
		Course c = new Course();
		c.setCname(dto.getCname().trim());
		c.setOwnerid(dto.getOwnerid());
		crepo.save(c);
		return "Course added successfully";
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<CourseDTO> getmycourse(int ownerid) {
		List<Course> listcourse = null;
		try {
			listcourse = crepo.findByownerid(ownerid);
		} catch (Exception e) {
			try {
				listcourse = crepo.findAll().stream().filter(c -> c.getOwnerid() == ownerid).toList();
			} catch (Exception ex) {
				listcourse = new ArrayList<>();
			}
		}

		List<CourseDTO> listdto = new ArrayList<>();
		if (listcourse == null) {
			return listdto;
		}

		Map<Integer, String> teacherNames = new HashMap<>();
		String teacherName = resolveTeacherName(ownerid, teacherNames);

		for (Course c : listcourse) {
			CourseDTO cd = new CourseDTO();
			cd.setCid(c.getCid());
			cd.setCname(c.getCname());
			cd.setOwnerid(c.getOwnerid());
			cd.setTeacherName(teacherName);

			List<UserRespDTO> ud = new ArrayList<>();
			// 1. Try fetching enrolled students via direct JDBC query (100% reliable)
			try {
				List<UserRespDTO> enrolled = jdbcTemplate.query(
					"SELECT u.uid, u.name, u.email, u.role FROM users u " +
					"INNER JOIN user_course uc ON u.uid = uc.uid " +
					"WHERE uc.cid = ?",
					(rs, rowNum) -> {
						UserRespDTO dto = new UserRespDTO();
						dto.setUid(rs.getInt("uid"));
						dto.setName(rs.getString("name"));
						dto.setEmail(rs.getString("email"));
						dto.setRole(rs.getString("role"));
						return dto;
					},
					c.getCid()
				);
				if (enrolled != null) {
					ud.addAll(enrolled);
				}
			} catch (Exception ex) {
				// Fallback to JPA entity relation if JDBC query fails
				try {
					List<Users> user = c.getUsers();
					if (user != null) {
						for (Users u : user) {
							if (u != null) {
								UserRespDTO dto = new UserRespDTO();
								dto.setUid(u.getUid());
								dto.setName(u.getName());
								dto.setEmail(u.getEmail());
								ud.add(dto);
							}
						}
					}
				} catch (Exception ex2) {
					System.err.println("Notice: could not read students for course " + c.getCid());
				}
			}

			cd.setUserRespDTO(ud);
			listdto.add(cd);
		}
		
		return listdto;
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<CourseRespDTO> getAllCourses() {
		List<CourseRespDTO> listCRD = new ArrayList<>();
		List<Course> listC = crepo.findAll();
		Map<Integer, String> teacherNames = new HashMap<>();
		for (Course c : listC) {
			CourseRespDTO CRD = new CourseRespDTO();
			CRD.setCid(c.getCid());
			CRD.setCname(c.getCname());
			CRD.setOwnerid(c.getOwnerid());
			CRD.setTeacherName(resolveTeacherName(c.getOwnerid(), teacherNames));
			listCRD.add(CRD);
		}
		return listCRD;
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<CourseRespDTO> getMyBuyCourses(int uid) {
		List<CourseRespDTO> listCRD = new ArrayList<>();
		Map<Integer, String> teacherNames = new HashMap<>();

		// 1. Direct JDBC Query for enrolled courses (rock-solid, never throws LazyInitException)
		try {
			List<CourseRespDTO> enrolled = jdbcTemplate.query(
				"SELECT c.cid, c.cname, c.ownerid FROM course c " +
				"INNER JOIN user_course uc ON c.cid = uc.cid " +
				"WHERE uc.uid = ?",
				(rs, rowNum) -> {
					CourseRespDTO dto = new CourseRespDTO();
					dto.setCid(rs.getInt("cid"));
					dto.setCname(rs.getString("cname"));
					dto.setOwnerid(rs.getInt("ownerid"));
					return dto;
				},
				uid
			);
			if (enrolled != null && !enrolled.isEmpty()) {
				for (CourseRespDTO dto : enrolled) {
					dto.setTeacherName(resolveTeacherName(dto.getOwnerid(), teacherNames));
					listCRD.add(dto);
				}
				return listCRD;
			}
		} catch (Exception ex) {
			System.err.println("JDBC getMyBuyCourses notice: " + ex.getMessage());
		}

		// 2. Fallback to JPA entity if JDBC query was not used
		try {
			Users user = urepo.findByIdWithCourses(uid).orElse(null);
			if (user != null && user.getCourse() != null) {
				for (Course c : user.getCourse()) {
					if (c != null) {
						CourseRespDTO dto = new CourseRespDTO();
						dto.setCid(c.getCid());
						dto.setCname(c.getCname());
						dto.setOwnerid(c.getOwnerid());
						dto.setTeacherName(resolveTeacherName(c.getOwnerid(), teacherNames));
						listCRD.add(dto);
					}
				}
			}
		} catch (Exception e) {
			System.err.println("Error in getMyBuyCourses JPA fallback: " + e.getMessage());
		}

		return listCRD;
	}

	@Override
	public String deleteCourse(int cid, int ownerid) {
		Course c = crepo.findById(cid).orElse(null);
		if (c == null) {
			return "Course not found";
		}
		if (c.getOwnerid() != ownerid) {
			return "Unauthorized: You are not the owner of this course";
		}
		// Clean up user_course associations first
		try {
			jdbcTemplate.update("DELETE FROM user_course WHERE cid = ?", cid);
		} catch (Exception ex) {
			System.err.println("Notice: direct cleanup of user_course for cid " + cid + ": " + ex.getMessage());
		}
		try {
			crepo.delete(c);
		} catch (Exception e) {
			crepo.deleteById(cid);
		}
		return "Course deleted successfully";
	}
}
