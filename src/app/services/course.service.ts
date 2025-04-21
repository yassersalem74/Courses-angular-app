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

    const startDate = course.startDate instanceof Date
      ? course.startDate.toISOString().split('T')[0]
      : course.startDate;

    const endDate = course.endDate instanceof Date
      ? course.endDate.toISOString().split('T')[0]
      : course.endDate;

    const newCourse: Course = {
      ...course,
      id: newId,
      startDate,
      endDate,
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
}
