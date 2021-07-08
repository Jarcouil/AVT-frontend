import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { UsersOverviewComponent } from './users-overview.component';
import { UsersOverviewServiceStub } from 'src/mocks/services/users-overview.service.stub';
import { UsersOverviewService } from './service/users-overview.service';
import { User } from '../account/user';

describe('UsersOverviewComponent', () => {
  let component: UsersOverviewComponent;
  let fixture: ComponentFixture<UsersOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersOverviewComponent ],
      imports: [
        HttpClientModule,
        NgxPaginationModule,
        RouterModule.forRoot([])
      ],
      providers: [{ provide: UsersOverviewService, useClass: UsersOverviewServiceStub }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expect users to not be empty', () => {
    expect(component.users.length).toBeGreaterThan(0);
  });
});
