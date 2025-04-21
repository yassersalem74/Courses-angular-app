import { Subcourse } from './subcourse.model';

export interface Course {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  subcourses: Subcourse[];
}
