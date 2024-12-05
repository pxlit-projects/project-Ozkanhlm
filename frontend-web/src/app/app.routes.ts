import { Routes } from '@angular/router';
import { PostListComponent } from './core/post/post-list/post-list.component';
import { AddPostComponent } from './core/post/add-post/add-post.component';
import { confirmLeaveGuard } from './confirm-leave.guard';
import { PostDetailComponent } from './core/post/post-detail/post-detail.component';
import { NoPageComponent } from './core/no-page/no-page.component';
import { LoginComponent } from './core/login/login.component';
import { authGuardGuard } from './auth-guard.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'posts',
    component: PostListComponent,
    canActivate: [authGuardGuard],
  },
  {
    path: 'add',
    component: AddPostComponent,
    canDeactivate: [confirmLeaveGuard],
    canActivate: [authGuardGuard],
  },
  {
    path: 'post/:id',
    component: PostDetailComponent,
    canActivate: [authGuardGuard],
  },

  { path: 'no-page', component: NoPageComponent },

  { path: '', redirectTo: 'posts', pathMatch: 'full' },

  { path: '**', component: NoPageComponent },
];
