import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ReviewsComponent } from './reviews.component';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReviewService } from '../../../shared/services/review.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ReviewsComponent', () => {
  let component: ReviewsComponent;
  let fixture: ComponentFixture<ReviewsComponent>;

  const activatedRouteMock = {
    snapshot: { paramMap: { get: () => '1' } },
  };

  const reviewServiceMock = {
    addReview: jasmine.createSpy().and.returnValue(of({})),
  };

  const snackBarMock = {
    open: jasmine.createSpy(),
  };

  const routerMock = {
    navigate: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsComponent, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ReviewService, useValue: reviewServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmitReview ', fakeAsync(() => {
    component.reviewForm.setValue({
      reviewStatus: 'REJECTED',
      reviewMessage: 'Not good!',
    });

    component.onSubmitReview();

    tick();

    expect(reviewServiceMock.addReview).toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Review succesvol ingediend!',
      'Sluiten',
      { duration: 3000 }
    );
  }));

  it('should show error snackBar if form is invalid', fakeAsync(() => {
    component.reviewForm.setValue({ reviewStatus: '', reviewMessage: '' });
    component.onSubmitReview();

    tick();

    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Het formulier is niet correct ingevuld!',
      'Sluiten',
      { duration: 3000 }
    );
  }));
});
