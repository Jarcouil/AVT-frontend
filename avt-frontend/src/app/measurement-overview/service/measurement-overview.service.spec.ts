import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { MeasurementOverviewService } from './measurement-overview.service';

describe('MeasurementOverviewService', () => {
  let service: MeasurementOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(MeasurementOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
