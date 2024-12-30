import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanDeactivateFn,
  RouterStateSnapshot,
} from '@angular/router';

import { confirmLeaveGuard } from './confirm-leave.guard';
import { AddPostComponent } from './core/post/add-post/add-post.component';
import { FormBuilder } from '@angular/forms';

describe('confirmLeaveGuard', () => {
  let mockComponent: AddPostComponent;
  let formBuilder: FormBuilder;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouterStateSnapshot: RouterStateSnapshot;

  const executeGuard: CanDeactivateFn<AddPostComponent> = (
    ...guardParameters
  ) =>
    TestBed.runInInjectionContext(() => confirmLeaveGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder],
    });

    formBuilder = TestBed.inject(FormBuilder);
    mockComponent = {
      postForm: formBuilder.group({
        title: '',
        content: '',
      }),
    } as AddPostComponent;

    mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    mockRouterStateSnapshot = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when form is not dirty', () => {
    mockComponent.postForm.markAsPristine();
    const result = executeGuard(
      mockComponent,
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
      mockRouterStateSnapshot
    );
    expect(result).toBe(true);
  });

  it('should prompt for confirmation when form is dirty', () => {
    mockComponent.postForm.markAsDirty();
    spyOn(window, 'confirm').and.returnValue(true);
    const result = executeGuard(
      mockComponent,
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
      mockRouterStateSnapshot
    );
    expect(window.confirm).toHaveBeenCalledWith(
      'Weet je zeker dat je deze pagina wilt verlaten?'
    );
    expect(result).toBe(true);
  });
});
