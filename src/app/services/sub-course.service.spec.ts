import { TestBed } from '@angular/core/testing';

import { SubCourseService } from './sub-course.service';

describe('SubCourseService', () => {
  let service: SubCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
