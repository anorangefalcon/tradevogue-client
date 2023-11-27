import { TestBed } from '@angular/core/testing';

import { EyePopService } from './eye-pop.service';

describe('EyePopService', () => {
  let service: EyePopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EyePopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
