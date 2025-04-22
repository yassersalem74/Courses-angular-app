import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubCourseComponent } from './edit-sub-course.component';

describe('EditSubCourseComponent', () => {
  let component: EditSubCourseComponent;
  let fixture: ComponentFixture<EditSubCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSubCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSubCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
