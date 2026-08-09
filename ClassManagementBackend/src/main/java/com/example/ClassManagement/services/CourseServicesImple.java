package com.example.ClassManagement.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ClassManagement.DTO.CourseDTO;
import com.example.ClassManagement.DTO.CourseRespDTO;
import com.example.ClassManagement.DTO.UserRespDTO;
import com.example.ClassManagement.entities.Course;
import com.example.ClassManagement.entities.Users;
import com.example.ClassManagement.repo.CourseRepo;
import com.example.ClassManagement.repo.UsersRepo;


@Service
public class CourseServicesImple implements CourseServices{

	@Autowired
	CourseRepo crepo;
	@Autowired
	UsersRepo urepo;
	
	@Override
	public String addcourse(CourseRespDTO dto) {
		Course c=new Course();
		c.setCname(dto.getCname());
		c.setOwnerid(dto.getOwnerid());
		crepo.save(c);
		return "Add Course";
	}
	
	
	@Override
	public List<CourseDTO> getmycourse(int ownerid) {
		List<Course>listcourse=crepo.findByownerid(ownerid);
		System.out.println(listcourse);
		List<CourseDTO>listdto= new ArrayList<CourseDTO>();
		for(Course c:listcourse) {
			CourseDTO cd=new CourseDTO();
			cd.setCid(c.getCid());
			cd.setCname(c.getCname());
			cd.setOwnerid(c.getOwnerid());
			List<Users>user= c.getUsers();
			List<UserRespDTO>ud=new ArrayList<UserRespDTO>();
			for(Users u:user) {
				UserRespDTO dto=new UserRespDTO();
				dto.setUid(u.getUid());
				dto.setName(u.getName());
				ud.add(dto);
			}
			cd.setUserRespDTO(ud);
			listdto.add(cd);
		}
		
		return  listdto;
	}
	
	@Override
	public List<CourseRespDTO> getAllCourses() {
		List<CourseRespDTO>listCRD=new ArrayList<CourseRespDTO>();
		List<Course>listC=crepo.findAll();
		for(Course c:listC) {
			CourseRespDTO CRD=new CourseRespDTO();
			CRD.setCid(c.getCid());
			CRD.setCname(c.getCname());
			CRD.setOwnerid(c.getOwnerid());
			listCRD.add(CRD);
			
		}
		return listCRD;
	}
	
	@Override
	public List<CourseRespDTO> getMyBuyCourses(int uid) {
		Users user=urepo.findById(uid).orElse(null);
		List<Course>listc=user.getCourse();
		List<CourseRespDTO>listCRD=new ArrayList<CourseRespDTO>();
		for(Course c:listc) {
			CourseRespDTO dto=new CourseRespDTO();
			dto.setCid(c.getCid());
			dto.setCname(c.getCname());
			dto.setOwnerid(c.getOwnerid());
			listCRD.add(dto);
		}
		return listCRD;
	}
}
