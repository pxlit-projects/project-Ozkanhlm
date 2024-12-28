import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RoleService } from '../../shared/services/role.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.development';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoleService: jasmine.SpyObj<RoleService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRoleService = jasmine.createSpyObj('RoleService', [
      'setRole',
      'setUser',
    ]);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent, BrowserAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: RoleService, useValue: mockRoleService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error if form is invalid', () => {
    const form = fixture.debugElement.query(By.css('form'));
    component.username = '';
    component.password = '';

    form.triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Vul alle velden correct in',
      'Sluiten',
      jasmine.objectContaining({ duration: 3000 })
    );
  });

  it('should navigate to /posts on successful login', () => {
    const form = fixture.debugElement.query(By.css('form'));
    component.username = 'gebruiker';
    component.password = '123';

    (environment.users as any) = [
      { username: 'gebruiker', password: '123', role: 'gebruiker' },
    ];

    form.triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();

    expect(mockRoleService.setRole).toHaveBeenCalledWith('gebruiker');
    expect(mockRoleService.setUser).toHaveBeenCalledWith('gebruiker');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts']);
  });
});
