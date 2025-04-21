import { Subcourse } from './subcourse.model';

export interface Course {
  id: number;
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  subcourses: Subcourse[];
}
