package com.example.ClassManagement.repo;

import org.springframework.data.jpa.repository.JpaRepository;


import com.example.ClassManagement.entities.Users;

public interface UsersRepo extends JpaRepository<Users,Integer>{
	Users findByEmail(String email);
}
