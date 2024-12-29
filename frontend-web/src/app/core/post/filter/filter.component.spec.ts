import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FilterComponent,
        FormsModule,
        MatNativeDateModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChanged event when form is submitted with valid data', () => {
    spyOn(component.filterChanged, 'emit');
    const testFilter = {
      content: 'Test Content',
      author: 'Test Author',
      createdDate: new Date(),
      title: 'Test Title',
    };
    component.filter = testFilter;

    const form = { valid: true };
    component.onSubmit(form);

    expect(component.filterChanged.emit).toHaveBeenCalledWith(testFilter);
  });

  it('should clear filter and emit filterChanged event when clearFilter is called', () => {
    spyOn(component.filterChanged, 'emit');
    component.filter = {
      content: 'Some Content',
      author: 'Some Author',
      createdDate: new Date(),
      title: 'Some Title',
    };

    component.clearFilter();

    expect(component.filter).toEqual({
      content: '',
      author: '',
      createdDate: null,
      title: '',
    });
  });
});
