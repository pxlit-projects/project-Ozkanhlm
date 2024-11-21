import { CanDeactivateFn } from '@angular/router';
import { AddPostComponent } from './core/post/add-post/add-post.component';

export const confirmLeaveGuard: CanDeactivateFn<AddPostComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (component.postForm.dirty) {
    return window.confirm('Weet je zeker dat je deze pagina wilt verlaten?');
  } else {
    return true;
  }
};
