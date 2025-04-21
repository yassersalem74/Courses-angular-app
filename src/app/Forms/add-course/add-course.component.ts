import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule
  ],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent {
  courseForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    public ref: DynamicDialogRef
  ) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    }, { validator: this.dateValidator });
  }

  dateValidator(form: FormGroup) {
    const startDate = form.get('startDate')?.value;
    const endDate = form.get('endDate')?.value;
    return startDate && endDate && new Date(startDate) < new Date(endDate)
      ? null
      : { dateError: true };
  }

  onSubmit() {
    this.submitted = true;

    if (this.isFormValid()) {
      const formValue = this.courseForm.value;
      const newCourse: Course = {
        id: 0,
        name: formValue.name.trim(),
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        subcourses: []
      };


      this.ref.close(newCourse);
    }
  }

  private isFormValid(): boolean {
    if (!this.courseForm.valid) {
      return false;
    }

    const values = this.courseForm.value;


    return !!values.name?.trim() &&
      !!values.startDate &&
      !!values.endDate &&
      new Date(values.startDate) < new Date(values.endDate);
  }

  private generateId(): number {
    return Math.floor(Math.random() * 10000) + 1;
  }
}
