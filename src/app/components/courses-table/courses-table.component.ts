import { Component } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './courses-table.component.html',
  styleUrls: ['./courses-table.component.css']
})
export class CoursesTableComponent {
  courses: Course[] = [];
  expandedRows: { [key: number]: boolean } = {};

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
        console.log('Courses loaded:', data);
      },
      error: (err) => {
        console.error('Error loading courses:', err);
      }
    });
  }

  toggleRow(course: Course) {
    this.expandedRows[course.id] = !this.expandedRows[course.id];
  }
}
