import { Component, Input } from '@angular/core';
import { Subcourse } from '../../models/subcourse.model';
import { TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { EditSubCourseComponent } from './../../Forms/edit-sub-course/edit-sub-course.component';
import { Course } from '../../models/course.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-subcourse-row-details',
  standalone: true,
  imports: [TableModule, DatePipe],
  templateUrl: './subcourse-row-details.component.html',
  styleUrl: './subcourse-row-details.component.css'
})
export class SubcourseRowDetailsComponent {
  @Input() subcourses!: Subcourse[];
  @Input() parentCourseId!: string;
  @Input() parentCourse!: Course;

  constructor(private dialogService: DialogService) {}

  openEditDialog(subCourseToEdit: Subcourse) {
    const ref = this.dialogService.open(EditSubCourseComponent, {
      header: 'Edit Subcourse',
      width: '370px',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      dismissableMask: true,
      data: {
        courseId: this.parentCourseId,
        parentCourse: this.parentCourse,
        subCourse: subCourseToEdit
      }
    });

    ref.onClose.subscribe((updatedSubCourse: Subcourse) => {
      if (updatedSubCourse) {
        const index = this.subcourses.findIndex(sc => sc.id === updatedSubCourse.id);
        if (index !== -1) {
          this.subcourses[index] = updatedSubCourse;
        }
      }
    });
  }
}
