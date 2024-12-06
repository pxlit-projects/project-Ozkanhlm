import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Filter } from '../../../shared/models/filter.model';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  filter: Filter = { content: '', author: '', createdDate: '', title: '' };

  @Output() filterChanged = new EventEmitter<Filter>();

  onSubmit(form: any) {
    if (form.valid) this.filterChanged.emit(this.filter);
  }
  clearFilter(): void {
    this.filter = { title: '', content: '', author: '', createdDate: '' };
    this.filterChanged.emit(this.filter);
  }
}
