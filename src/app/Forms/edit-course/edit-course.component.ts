import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule
  ],
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  courseForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    const course: Course = this.config.data.course;

    this.courseForm = this.fb.group({
      name: [course.name, Validators.required],
      startDate: [new Date(course.startDate), Validators.required],
      endDate: [new Date(course.endDate), Validators.required]
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

    if (this.courseForm.valid) {
      const formValue = this.courseForm.value;
      const updatedCourse: Course = {
        ...this.config.data.course,
        name: formValue.name.trim(),
        startDate: formValue.startDate,
        endDate: formValue.endDate
      };
      this.ref.close(updatedCourse);
    }
  }
}