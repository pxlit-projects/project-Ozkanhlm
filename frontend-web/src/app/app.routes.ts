import { Routes } from '@angular/router';
import { PostListComponent } from './core/post/post-list/post-list.component';
import { AddPostComponent } from './core/post/add-post/add-post.component';
import { confirmLeaveGuard } from './confirm-leave.guard';
import { PostDetailComponent } from './core/post/post-detail/post-detail.component';
import { NoPageComponent } from './no-page/no-page.component';

export const routes: Routes = [
  { path: 'posts', component: PostListComponent },
  {
    path: 'add',
    component: AddPostComponent,
    canDeactivate: [confirmLeaveGuard],
  },
  { path: 'post/:id', component: PostDetailComponent },

  { path: 'no-page', component: NoPageComponent },

  { path: '', redirectTo: 'posts', pathMatch: 'full' },

  { path: '**', component: NoPageComponent },
];
