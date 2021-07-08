import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { UsersOverviewService } from './users-overview.service';

describe('UsersOverviewService', () => {
  let service: UsersOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(UsersOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
