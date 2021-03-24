import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementOverviewComponent } from './measurement-overview.component';

describe('MeasurementOverviewComponent', () => {
  let component: MeasurementOverviewComponent;
  let fixture: ComponentFixture<MeasurementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasurementOverviewComponent ]
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
