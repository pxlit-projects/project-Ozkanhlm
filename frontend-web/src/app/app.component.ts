import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PostListComponent } from './core/post/post-list/post-list.component';
import { CommonModule } from '@angular/common';
import { AddPostComponent } from './core/post/add-post/add-post.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AddPostComponent,
    PostListComponent,
    AddPostComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Content Management';
}
