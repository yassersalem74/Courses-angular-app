import { Component, Input } from '@angular/core';
import { Subcourse } from '../../models/subcourse.model';
import { TableModule } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { EditSubCourseComponent } from './../../Forms/edit-sub-course/edit-sub-course.component';
import { Course } from '../../models/course.model';
import { DatePipe } from '@angular/common';
import { SubCourseService } from '../../services/sub-course.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-subcourse-row-details',
  standalone: true,
  imports: [TableModule, DatePipe , ButtonModule],
  templateUrl: './subcourse-row-details.component.html',
  styleUrl: './subcourse-row-details.component.css'
})
export class SubcourseRowDetailsComponent {
  @Input() subcourses!: Subcourse[];
  @Input() parentCourseId!: string;
  @Input() parentCourse!: Course;

  constructor(
    private dialogService: DialogService,
    private subCourseService: SubCourseService
  ) {}

  openEditDialog(subCourseToEdit: Subcourse) {
    const ref = this.dialogService.open(EditSubCourseComponent, {
      header: 'Edit Subcourse',
      width: '370px',
      contentStyle: { 'height': '400px', overflow: 'auto' },
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

  deleteSubCourse(subCourseId: number) {
    const confirmed = window.confirm('Are you sure you want to delete this subcourse?');
    if (!confirmed) return;

    const courseId = +this.parentCourseId;
    this.subCourseService.deleteSubCourse(courseId, subCourseId).subscribe({
      next: updatedSubcourses => {
        this.subcourses = updatedSubcourses;
      },
      error: err => {
        console.error('Failed to delete subcourse:', err);
        alert('Error: ' + err.message);
      }
    });
  }
}
