import { TestBed } from '@angular/core/testing';

import { StripPaymentService } from './strip-payment.service';

describe('StripPaymentService', () => {
  let service: StripPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
