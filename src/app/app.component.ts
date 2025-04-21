import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import {  ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CoursesTableComponent } from "./components/courses-table/courses-table.component";

@Component({
  selector: 'app-root',
  imports: [ ButtonModule, TableModule, CoursesTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'courses';
}
