import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcourseRowDetailsComponent } from './subcourse-row-details.component';

describe('SubcourseRowDetailsComponent', () => {
  let component: SubcourseRowDetailsComponent;
  let fixture: ComponentFixture<SubcourseRowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcourseRowDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcourseRowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
