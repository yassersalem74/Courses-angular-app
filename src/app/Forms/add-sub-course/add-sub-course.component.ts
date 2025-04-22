import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SubCourseService } from '../../services/sub-course.service';
import { MessageService } from 'primeng/api';
import { Course } from '../../models/course.model';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-sub-course',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './add-sub-course.component.html',
  styleUrls: ['./add-sub-course.component.css'],
  providers: [MessageService]
})
export class AddSubCourseComponent implements OnInit {
  subCourseForm!: FormGroup;
  courseId!: number;
  parentCourse!: Course;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private subCourseService: SubCourseService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private messageService: MessageService
  ) {
    this.courseId = config.data.courseId;
    this.parentCourse = config.data.parentCourse;
  }

  ngOnInit() {

    this.parentCourse.startDate = this.convertToLocalDate(new Date(this.parentCourse.startDate));
    this.parentCourse.endDate = this.convertToLocalDate(new Date(this.parentCourse.endDate));

    this.subCourseForm = this.fb.group({
      name: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    }, {
      validators: [this.dateRangeValidator.bind(this)]
    });
  }

  private convertToLocalDate(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }

  private dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;

    if (!start || !end) return null;

    const startDate = this.convertToLocalDate(new Date(start));
    const endDate = this.convertToLocalDate(new Date(end));
    const parentStart = this.parentCourse.startDate;
    const parentEnd = this.parentCourse.endDate;

    const errors: ValidationErrors = {};

    if (startDate < parentStart) {
      errors['startBeforeParent'] = true;
    }

    if (endDate > parentEnd) {
      errors['endAfterParent'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  onSubmit() {
    this.submitted = true;

    if (this.subCourseForm.invalid) {
      return;
    }

    const formValue = this.subCourseForm.value;


    const startDate = this.convertToLocalDate(new Date(formValue.startDate));
    const endDate = this.convertToLocalDate(new Date(formValue.endDate));

    console.log('Start Date:', startDate.toISOString().split('T')[0]);
    console.log('End Date:', endDate.toISOString().split('T')[0]);

    const subCourse = {
      name: formValue.name.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      courseId: this.courseId
    };

    this.subCourseService.addSubCourse(this.courseId, subCourse).subscribe({
      next: (createdSubCourse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Subcourse created successfully'
        });
        this.ref.close(createdSubCourse);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to create subcourse'
        });
      }
    });
  }
}