import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    this.initializeForm();
  }

  private initializeForm(): void {
    this.subCourseForm = this.fb.group({
      name: ['', Validators.required],
      startDate: [null, [Validators.required, this.validateStartDate.bind(this)]],
      endDate: [null, [Validators.required, this.validateEndDate.bind(this)]]
    }, { validator: this.dateRangeValidator.bind(this) });
  }

  validateStartDate(control: any): { [key: string]: boolean } | null {
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

  dateRangeValidator(form: FormGroup): { [key: string]: boolean } | null {
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

  getMinStartDate(): Date {
    return new Date(this.parentCourse.startDate);
  }

  getMaxEndDate(): Date {
    return new Date(this.parentCourse.endDate);
  }

  getMinEndDate(): Date | null {
    const startDate = this.subCourseForm.get('startDate')?.value;
    return startDate ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 1)) : null;
  }

  onSubmit() {
    this.submitted = true;

    if (this.subCourseForm.invalid) {
      return;
    }

    const formValue = this.subCourseForm.value;
    const subCourse = {
      name: formValue.name.trim(),
      startDate: formValue.startDate,
      endDate: formValue.endDate
    };

    try {
      this.subCourseService.validateSubCourseDates(this.parentCourse, subCourse);

      const formattedSubCourse = {
        ...subCourse,
        startDate: new Date(subCourse.startDate),
        endDate: new Date(subCourse.endDate),
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
        },

      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }
}
