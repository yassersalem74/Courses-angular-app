import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { Course } from '../../models/course.model';
import { Subcourse } from '../../models/subcourse.model';
import { SubCourseService } from '../../services/sub-course.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-sub-course',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    ToastModule
  ],
  templateUrl: './edit-sub-course.component.html',
  styleUrls: ['./edit-sub-course.component.css'],
  providers: [MessageService]
})
export class EditSubCourseComponent implements OnInit {
  subCourseForm!: FormGroup;
  submitted = false;
  courseId!: number;
  parentCourse!: Course;
  subCourse!: Subcourse;

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private subCourseService: SubCourseService,
    private messageService: MessageService
  ) {}

  ngOnInit() {

    this.courseId = this.config.data.courseId;
    this.parentCourse = this.config.data.parentCourse;
    this.subCourse = this.config.data.subCourse;


    this.subCourseForm = this.fb.group({
      name: [this.subCourse.name, Validators.required],
      startDate: [new Date(this.subCourse.startDate), [
        Validators.required,
        this.validateStartDate.bind(this)
      ]],
      endDate: [new Date(this.subCourse.endDate), [
        Validators.required,
        this.validateEndDate.bind(this)
      ]]
    }, { validator: this.dateValidator.bind(this) });
  }

  validateStartDate(control: any): { [key: string]: boolean } | null {
    if (!this.parentCourse) return null;

    const date = new Date(control.value);
    const parentStart = new Date(this.parentCourse.startDate);
    const parentEnd = new Date(this.parentCourse.endDate);

    if (date < parentStart) {
      return { minDate: true };
    }
    if (date > parentEnd) {
      return { maxDate: true };
    }
    return null;
  }

  validateEndDate(control: any): { [key: string]: boolean } | null {
    if (!this.parentCourse) return null;

    const date = new Date(control.value);
    const parentEnd = new Date(this.parentCourse.endDate);
    const startDate = this.subCourseForm?.get('startDate')?.value;

    if (date > parentEnd) {
      return { maxDate: true };
    }
    if (startDate && new Date(date) <= new Date(startDate)) {
      return { minDate: true };
    }
    return null;
  }

  dateValidator(form: FormGroup): { [key: string]: boolean } | null {
    const startDate = form.get('startDate')?.value;
    const endDate = form.get('endDate')?.value;

    if (!startDate || !endDate) {
      return null;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return { dateError: true };
    }

    return null;
  }

  onSubmit() {
    this.submitted = true;

    if (this.subCourseForm.valid) {
      const formValue = this.subCourseForm.value;
      const updatedSubCourse: Subcourse = {
        ...this.subCourse,
        name: formValue.name.trim(),
        startDate: formValue.startDate,
        endDate: formValue.endDate
      };

      this.subCourseService.updateSubCourse(this.courseId, updatedSubCourse).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Subcourse updated successfully'
          });
          this.ref.close(updatedSubCourse);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to update subcourse'
          });
        }
      });
    }
  }
}
