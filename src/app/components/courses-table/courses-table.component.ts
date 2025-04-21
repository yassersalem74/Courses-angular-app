import { Component } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SubcourseRowDetailsComponent } from '../subcourse-row-details/subcourse-row-details.component';

@Component({
  selector: 'app-courses-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    SubcourseRowDetailsComponent  // Add this import
  ],
  templateUrl: './courses-table.component.html',
  styleUrls: ['./courses-table.component.css']
})
export class CoursesTableComponent {
  courses: Course[] = [];
  expandedRows: number[] = [];

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

  toggleSubcourses(courseId: number) {
    const index = this.expandedRows.indexOf(courseId);
    if (index >= 0) {
      this.expandedRows.splice(index, 1);
    } else {
      this.expandedRows.push(courseId);
    }
  }

  isExpanded(courseId: number): boolean {
    return this.expandedRows.includes(courseId);
  }
}
