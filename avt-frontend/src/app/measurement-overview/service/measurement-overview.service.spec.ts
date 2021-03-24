import { TestBed } from '@angular/core/testing';

import { MeasurementOverviewService } from './measurement-overview.service';

describe('MeasurementOverviewService', () => {
  let service: MeasurementOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasurementOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
