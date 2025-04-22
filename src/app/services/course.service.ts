import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { Course } from '../models/course.model';
import { Subcourse } from '../models/subcourse.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private coursesData: Course[] = [];

  constructor(private http: HttpClient) {}


  private initializeData(): Observable<void> {
    return this.http.get<any>('/data/courses.json').pipe(
      tap(response => {
        this.coursesData = response.courses;
        console.log('Initial courses loaded:', this.coursesData);
      }),
      map(() => {})
    );
  }

  getCourses(): Observable<Course[]> {
    if (this.coursesData.length > 0) {
      return of([...this.coursesData]);
    }
    return this.initializeData().pipe(
      map(() => [...this.coursesData])
    );
  }

  getSubcourses(courseId: number): Observable<Subcourse[]> {
    return this.getCourses().pipe(
      map(courses => {
        const course = courses.find(c => c.id === courseId);
        return course?.subcourses || [];
      })
    );
  }
  addCourse(course: Course): Observable<Course> {
    const newId = this.generateNewId();

    const newCourse: Course = {
      ...course,
      id: newId,
      startDate: this.formatDateWithoutTimezone(course.startDate),
      endDate: this.formatDateWithoutTimezone(course.endDate),
      subcourses: course.subcourses || []
    };

    this.coursesData = [...this.coursesData, newCourse];
    console.log('Course added:', newCourse);
    return of(newCourse);
  }

  private generateNewId(): number {
    return this.coursesData.length > 0
      ? Math.max(...this.coursesData.map(c => c.id)) + 1
      : 1;
  }

  private formatDate(date: string | Date): string {
    return typeof date === 'string' ? date : date.toISOString().split('T')[0];
  }

  editCourse(updatedCourse: Course): Observable<Course> {
    const formattedCourse: Course = {
      ...updatedCourse,
      startDate: this.formatDateWithoutTimezone(updatedCourse.startDate),
      endDate: this.formatDateWithoutTimezone(updatedCourse.endDate)
    };

    this.coursesData = this.coursesData.map(course =>
      course.id === formattedCourse.id ? formattedCourse : course
    );

    console.log('Course updated:', formattedCourse);
    return of(formattedCourse);
  }

  private formatDateWithoutTimezone(date: string | Date): string {
    if (typeof date === 'string') return date;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
