package com.example.demo.config;

import java.util.List;
import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.entity.Student;
import com.example.demo.repository.StudentRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final StudentRepository studentRepository;

    public DataSeeder(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(String... args) {
        if (studentRepository.count() > 0) {
            return;
        }

        List<Student> students = List.of(
                new Student("SV001", "Nguyễn Văn A", "a@gmail.com", "0901234567", "C2024A"),
                new Student("SV002", "Trần Thị B", "b@gmail.com", "0912345678", "C2024B"),
                new Student("SV003", "Lê Hoàng C", "c@gmail.com", "0923456789", "C2024C"),
                new Student("SV004", "Phạm Minh Dũng", "d@gmail.com", "0933456789", "C2024A"),
                new Student("SV005", "Hoàng Thị Em", "e@gmail.com", "0944567890", "C2024B"),
                new Student("SV006", "Vũ Đức F", "f@gmail.com", "0955678901", "C2024C"),
                new Student("SV007", "Đặng Nhật Anh", "g@gmail.com", "0966789012", "C2024A"),
                new Student("SV008", "Bùi Thảo H", "h@gmail.com", "0977890123", "C2024B"),
                new Student("SV009", "Ngô Quốc I", "i@gmail.com", "0988901234", "C2024C"),
                new Student("SV010", "Mai Lan K", "k@gmail.com", "0999012345", "C2024A")
        );

        students.forEach(student -> {
            student.setId(UUID.randomUUID());
        });

        studentRepository.saveAll(students);
    }
}
