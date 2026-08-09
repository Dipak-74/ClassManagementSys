package com.example.ClassManagement.DTO;

import java.util.List;



public class CourseDTO {

		int  cid;
		String cname;
		int ownerid;
		List<UserRespDTO>userRespDTO;
		public int getCid() {
			return cid;
		}
		public void setCid(int cid) {
			this.cid = cid;
		}
		public String getCname() {
			return cname;
		}
		public void setCname(String cname) {
			this.cname = cname;
		}
		public int getOwnerid() {
			return ownerid;
		}
		public void setOwnerid(int ownerid) {
			this.ownerid = ownerid;
		}
		public List<UserRespDTO> getUserRespDTO() {
			return userRespDTO;
		}
		public void setUserRespDTO(List<UserRespDTO> userRespDTO) {
			this.userRespDTO = userRespDTO;
		}
		
		
}
