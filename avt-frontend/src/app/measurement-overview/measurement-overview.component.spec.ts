import { NgxPaginationModule } from 'ngx-pagination';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AuthServiceStub } from 'src/mocks/services/auth.service.stub';
import { AuthService } from '../shared/services/auth.service';

import { MeasurementOverviewComponent } from './measurement-overview.component';

describe('MeasurementOverviewComponent', () => {
  let component: MeasurementOverviewComponent;
  let fixture: ComponentFixture<MeasurementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasurementOverviewComponent ],
      imports: [
        HttpClientModule,
        NgxPaginationModule
      ],
      providers: [{ provide: AuthService, useClass: AuthServiceStub }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
