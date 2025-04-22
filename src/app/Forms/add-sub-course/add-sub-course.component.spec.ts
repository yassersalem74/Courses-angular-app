import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubCourseComponent } from './add-sub-course.component';

describe('AddSubCourseComponent', () => {
  let component: AddSubCourseComponent;
  let fixture: ComponentFixture<AddSubCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSubCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSubCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
