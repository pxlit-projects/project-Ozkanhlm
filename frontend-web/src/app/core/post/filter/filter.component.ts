import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Filter } from '../../../shared/models/filter.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  filter: Filter = { content: '', author: '', createdDate: null, title: '' };

  @Output() filterChanged = new EventEmitter<Filter>();

  onSubmit(form: any) {
    if (form.valid) this.filterChanged.emit(this.filter);
  }
  clearFilter(): void {
    this.filter = { title: '', content: '', author: '', createdDate: null };
    this.filterChanged.emit(this.filter);
  }
}
