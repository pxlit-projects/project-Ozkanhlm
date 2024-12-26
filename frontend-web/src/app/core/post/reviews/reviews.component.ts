import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { Review } from '../../../shared/models/review.model';
import { ReviewService } from '../../../shared/services/review.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatRadioModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
})
export class ReviewsComponent {
  @Input() postReviews: Review[] | undefined = [];
  @Input() id: number | undefined;

  snackBar: MatSnackBar = inject(MatSnackBar);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  reviewService: ReviewService = inject(ReviewService);
  isRejected: boolean = false;

  reviewForm: FormGroup = this.fb.group({
    reviewStatus: ['', Validators.required],
    reviewMessage: [''],
  });

  onSubmitReview(): void {
    if (!this.reviewForm.valid) {
      this.snackBar.open('Het formulier is niet correct ingevuld!', 'Sluiten', {
        duration: 3000,
      });
      console.warn('Review form is not valid');
      return;
    }

    const reviewData: Review = { ...this.reviewForm.value, postId: this.id };

    this.reviewService.addReview(reviewData).subscribe({
      next: () => {
        this.snackBar.open('Review succesvol ingediend!', 'Sluiten', {
          duration: 3000,
        });
        this.router.navigate(['/workbanch']);
      },
      error: (err) => console.error('Error adding review:', err),
    });
  }

  onStatusChange(status: string): void {
    this.isRejected = status === 'REJECTED';
  }
}
