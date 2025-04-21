import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Course   } from '../models/course.model';
import { Subcourse } from './../models/subcourse.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private http: HttpClient) {}


  getCourses(): Observable<Course[]> {
    return this.http.get<any>('/data/courses.json').pipe(
      map(response => response.courses)
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
}
