import { Component, inject, Input } from '@angular/core';
import { Post } from '../../../shared/models/post.model';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoleService } from '../../../shared/services/role.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent {
  roleService: RoleService = inject(RoleService);
  role = this.roleService.getRole();

  @Input() post!: Post;
}
