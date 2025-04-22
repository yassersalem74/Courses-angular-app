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
import { AddSubCourseComponent } from '../../Forms/add-sub-course/add-sub-course.component';

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

  deleteCourse(courseId: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(courseId).subscribe({
        next: () => {
          if (this.courses.length > 1) {
            this.loadCourses();
          } else {
            this.courses = this.courses.filter(c => c.id !== courseId);
          }
          console.log('Course deleted successfully');
        },
        error: (err) => console.error('Error deleting course:', err)
      });
    }
  }


// In CoursesTableComponent
// In your CoursesTableComponent
openAddSubCourseDialog(courseId: number) {
  // First get the parent course data
  const parentCourse = this.courses.find(c => c.id === courseId);

  const ref = this.dialogService.open(AddSubCourseComponent, {
    header: 'Add New Subcourse',
    width: '400px',
    contentStyle: { 'max-height': '500px', overflow: 'auto' }, // Add this
    dismissableMask: true, // Add this
    data: {
      courseId,
      parentCourse // Pass the actual course data
    }
  });

  ref.onClose.subscribe((newSubCourse: any) => {
    if (newSubCourse) {
      this.loadCourses(); // Just reload all courses instead of manual manipulation
    }
  });
}
}
