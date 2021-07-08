import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { TwodimensionalgraphService } from './twodimensionalgraph.service';

describe('TwodimensionalgraphService', () => {
  let service: TwodimensionalgraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
    ]
    });
    service = TestBed.inject(TwodimensionalgraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
