import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Course } from '../models/course.model';

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

}
