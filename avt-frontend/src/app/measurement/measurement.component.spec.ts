import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MeasurementComponent } from './measurement.component';
import { MeasurementService } from './service/measurement.service';
import { MeasurementServiceStub } from 'src/mocks/services/measurement.service.stub';

describe('MeasurementComponent', () => {
  let component: MeasurementComponent;
  let fixture: ComponentFixture<MeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasurementComponent ],
      imports: [ 
        HttpClientModule,
        RouterModule.forRoot([])
     ],
     providers: [{ provide: MeasurementService, useClass: MeasurementServiceStub }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
