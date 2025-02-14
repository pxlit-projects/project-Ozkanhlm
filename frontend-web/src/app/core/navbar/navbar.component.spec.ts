import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { BehaviorSubject } from 'rxjs';
import { RoleService } from '../../shared/services/role.service';
import { RouterTestingModule } from '@angular/router/testing';
describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockRoleService: jasmine.SpyObj<RoleService>;
  let roleSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    roleSubject = new BehaviorSubject('redacteur');
    mockRoleService = jasmine.createSpyObj(
      'RoleService',
      ['setRole', 'setUser'],
      {
        role$: roleSubject.asObservable(),
      }
    );

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterTestingModule.withRoutes([
          { path: 'login', component: NavbarComponent },
        ]),
      ],
      providers: [{ provide: RoleService, useValue: mockRoleService }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset role and user on logout', () => {
    component.logout();

    expect(mockRoleService.setRole).toHaveBeenCalledWith(null);
    expect(mockRoleService.setUser).toHaveBeenCalledWith(null);
  });
});
