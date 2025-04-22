import { Component } from '@angular/core';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SubcourseRowDetailsComponent } from '../subcourse-row-details/subcourse-row-details.component';
import { DialogService } from 'primeng/dynamicdialog'; // New import
import { AddCourseComponent } from './../../Forms/add-course/add-course.component';
import { EditCourseComponent } from './../../Forms/edit-course/edit-course.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-courses-table',
  standalone: true,
  imports: [
  TableModule,
    ButtonModule,
    SubcourseRowDetailsComponent,
    CommonModule,
  ],
  templateUrl: './courses-table.component.html',
  styleUrls: ['./courses-table.component.css'],
  providers: [DialogService]
})
export class CoursesTableComponent {
  courses: Course[] = [];
  expandedRows: number[] = [];

  constructor(
    private courseService: CourseService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
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


  openAddCourseDialog() {
    const ref = this.dialogService.open(AddCourseComponent, {
      header: 'Add New Course',
      width: '370px',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      dismissableMask: true
    });

    ref.onClose.subscribe((newCourse: Course) => {
      if (newCourse) {
        this.courseService.addCourse(newCourse).subscribe({
          next: () => this.loadCourses(),
          error: (err) => console.error('Error adding course:', err)
        });
      }
    });
  }


openEditCourseDialog(course: Course) {
  const ref = this.dialogService.open(EditCourseComponent, {
    header: 'Edit Course',
    width: '370px',
    contentStyle: { 'max-height': '500px', overflow: 'auto' },
    dismissableMask: true,
    data: { course }
  });

  ref.onClose.subscribe((updatedCourse: Course) => {
    if (updatedCourse) {

      this.courseService.editCourse(updatedCourse).subscribe({
        next: () => {
          this.loadCourses();
          console.log('Course updated successfully');
        },
        error: (err) => console.error('Error updating course:', err)
      });
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
