import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ResetService } from './reset.service';

describe('ResetService', () => {
  let service: ResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(ResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
