import { Injectable } from '@angular/core';
import { Observable, of, map, catchError, throwError } from 'rxjs';
import { Course } from '../models/course.model';
import { Subcourse } from '../models/subcourse.model';
import { CourseService } from './course.service';

@Injectable({
  providedIn: 'root'
})
export class SubCourseService {
  constructor(private courseService: CourseService) {}

  addSubCourse(courseId: number, subCourse: Omit<Subcourse, 'id' | 'courseId'>): Observable<Subcourse> {
    return this.courseService.getCourses().pipe(
      map((courses: Course[]) => {
        const course = this.validateAndPrepareCourse(courses, courseId, subCourse);
        const updatedCourse = this.updateCourseWithSubcourse(course, subCourse);
        const newSubCourseId = this.generateNewId(course.subcourses);

        // Find the newly added subcourse (guaranteed to exist)
        const newSubCourse = updatedCourse.subcourses.find(sc => sc.id === newSubCourseId);
        if (!newSubCourse) {
          throw new Error('Failed to create subcourse');
        }

        this.courseService.editCourse(updatedCourse).subscribe();
        return newSubCourse;
      }),
      catchError(error => {
        console.error('Error adding subcourse:', error);
        return throwError(() => new Error(this.getUserFriendlyError(error)));
      })
    );
  }

  validateSubCourseDates(course: Course, subCourse: Omit<Subcourse, 'id' | 'courseId'>): void {
    const errors: string[] = [];
    const courseStart = new Date(course.startDate);
    const courseEnd = new Date(course.endDate);
    const subStart = new Date(subCourse.startDate);
    const subEnd = new Date(subCourse.endDate);

    // Date order validation
    if (subEnd <= subStart) {
      errors.push('End date must be after start date');
    }

    // Parent course range validation
    if (subStart < courseStart || subEnd > courseEnd) {
      errors.push('Dates must be within parent course range');
    }

    // Overlap validation
    if (course.subcourses?.some(existing => this.datesOverlap(
      { start: subStart, end: subEnd },
      { start: new Date(existing.startDate), end: new Date(existing.endDate) }
    ))) {
      errors.push('Dates overlap with existing subcourse');
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  }

  private validateAndPrepareCourse(courses: Course[], courseId: number, subCourse: Omit<Subcourse, 'id' | 'courseId'>): Course {
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      throw new Error('Parent course not found');
    }

    this.validateSubCourseDates(course, subCourse);
    return course;
  }

  private updateCourseWithSubcourse(course: Course, subCourse: Omit<Subcourse, 'id' | 'courseId'>): Course {
    const newSubCourse: Subcourse = {
      ...subCourse,
      id: this.generateNewId(course.subcourses),
      courseId: course.id,
      startDate: this.formatDateWithoutTimezone(subCourse.startDate),
      endDate: this.formatDateWithoutTimezone(subCourse.endDate)
    };

    return {
      ...course,
      subcourses: [...(course.subcourses || []), newSubCourse]
    };
  }

  private datesOverlap(range1: { start: Date, end: Date }, range2: { start: Date, end: Date }): boolean {
    return range1.start < range2.end && range1.end > range2.start;
  }

  private generateNewId(subcourses: Subcourse[] = []): number {
    return subcourses.length > 0
      ? Math.max(...subcourses.map(sc => sc.id)) + 1
      : 1;
  }

  private formatDateWithoutTimezone(date: string | Date): string {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  private getUserFriendlyError(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred while adding the subcourse';
  }
}