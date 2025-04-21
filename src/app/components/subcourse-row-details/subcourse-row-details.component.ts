import { Component , Input } from '@angular/core';
import { Subcourse } from '../../models/subcourse.model';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-subcourse-row-details',
  imports: [TableModule],
  templateUrl: './subcourse-row-details.component.html',
  styleUrl: './subcourse-row-details.component.css'
})
export class SubcourseRowDetailsComponent {
  @Input() subcourses!: Subcourse[];
}
