package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String homePage() {
        return "forward:/students.html";
    }

    @GetMapping("/students")
    public String studentsPage() {
        return "forward:/students.html";
    }
}