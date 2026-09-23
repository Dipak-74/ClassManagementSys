package com.example.ClassManagement.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
			System.err.println("Warning: findByownerid with JOIN FETCH failed, using fallback query: " + e.getMessage());
			try {
				listcourse = crepo.findAll().stream().filter(c -> c.getOwnerid() == ownerid).toList();
			} catch (Exception ex) {
				System.err.println("Error in fallback findAll: " + ex.getMessage());
				listcourse = new ArrayList<>();
			}
		}

		List<CourseDTO> listdto = new ArrayList<>();
		if (listcourse == null) {
			return listdto;
		}

		for (Course c : listcourse) {
			CourseDTO cd = new CourseDTO();
			cd.setCid(c.getCid());
			cd.setCname(c.getCname());
			cd.setOwnerid(c.getOwnerid());

			List<Users> user = null;
			try {
				user = c.getUsers();
			} catch (Exception ex) {
				System.err.println("Notice: could not lazily load users for course " + c.getCid() + ": " + ex.getMessage());
				user = new ArrayList<>();
			}

			List<UserRespDTO> ud = new ArrayList<>();
			if (user != null) {
				try {
					for (Users u : user) {
						if (u != null) {
							UserRespDTO dto = new UserRespDTO();
							dto.setUid(u.getUid());
							dto.setName(u.getName());
							dto.setEmail(u.getEmail());
							ud.add(dto);
						}
					}
				} catch (Exception ex) {
					System.err.println("Notice: error reading users collection: " + ex.getMessage());
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
		for (Course c : listC) {
			CourseRespDTO CRD = new CourseRespDTO();
			CRD.setCid(c.getCid());
			CRD.setCname(c.getCname());
			CRD.setOwnerid(c.getOwnerid());
			listCRD.add(CRD);
		}
		return listCRD;
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<CourseRespDTO> getMyBuyCourses(int uid) {
		List<CourseRespDTO> listCRD = new ArrayList<>();
		try {
			Users user = null;
			try {
				user = urepo.findByIdWithCourses(uid).orElse(null);
			} catch (Exception e) {
				user = urepo.findById(uid).orElse(null);
			}

			if (user != null) {
				List<Course> listc = null;
				try {
					listc = user.getCourse();
				} catch (Exception ex) {
					listc = new ArrayList<>();
				}

				if (listc != null) {
					for (Course c : listc) {
						if (c != null) {
							CourseRespDTO dto = new CourseRespDTO();
							dto.setCid(c.getCid());
							dto.setCname(c.getCname());
							dto.setOwnerid(c.getOwnerid());
							listCRD.add(dto);
						}
					}
				}
			}
		} catch (Exception e) {
			System.err.println("Error in getMyBuyCourses: " + e.getMessage());
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
		try {
			List<Users> users = c.getUsers();
			if (users != null) {
				for (Users u : users) {
					if (u != null && u.getCourse() != null) {
						u.getCourse().removeIf(item -> item.getCid() == cid);
						urepo.save(u);
					}
				}
			}
		} catch (Exception e) {
			System.err.println("Notice: cascade remove on deleteCourse failed: " + e.getMessage());
		}
		crepo.delete(c);
		return "Course deleted successfully";
	}
}
