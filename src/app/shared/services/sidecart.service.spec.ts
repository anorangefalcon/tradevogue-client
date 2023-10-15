import { TestBed } from '@angular/core/testing';

import { SidecartService } from './sidecart.service';

describe('SidecartService', () => {
  let service: SidecartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidecartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
