import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCardComponent } from './post-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ActivatedRoute,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { RoleService } from '../../../shared/services/role.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCardComponent],
      providers: [
        provideRouter([], withComponentInputBinding()),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        {
          provide: RoleService,
          useValue: { getRole: () => 'redacteur' },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;

    component.post = {
      id: 1,
      title: 'Test Post',
      content: 'This is a test post content.',
      picture: '',
      author: 'Ozkan',
      category: 'EVENTS',
      status: 'PENDING',
      createdDate: '2024-11-24',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
