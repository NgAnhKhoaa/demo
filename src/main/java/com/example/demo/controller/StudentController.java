package com.example.demo.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Student;
import com.example.demo.service.StudentService;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // 1. GET /api/students  hoặc  /api/students?keyword=abc
    @GetMapping
    public List<Student> listStudents(@RequestParam(required = false) String keyword) {
        return studentService.search(keyword);
    }

    // 2. GET /api/students/{id}
    @GetMapping("/{id}")
    public Student getStudent(@PathVariable UUID id) {
        return studentService.getById(id);
    }

    // 3. POST /api/students  -- THÊM MỚI
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentService.save(student);
    }

    // 4. PUT /api/students/{id}  -- CẬP NHẬT
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable UUID id, @RequestBody Student student) {
        student.setId(id);
        return studentService.save(student);
    }

    // 5. DELETE /api/students/{id}  -- XÓA
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable UUID id) {
        studentService.delete(id);
    }
}