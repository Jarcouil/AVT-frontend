import { TestBed } from '@angular/core/testing';

import { TwodimensionalgraphService } from './twodimensionalgraph.service';

describe('TwodimensionalgraphService', () => {
  let service: TwodimensionalgraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwodimensionalgraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
