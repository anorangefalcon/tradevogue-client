import { TestBed } from '@angular/core/testing';

import { BillingResponseService } from './billing-response.service';

describe('BillingResponseService', () => {
  let service: BillingResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
