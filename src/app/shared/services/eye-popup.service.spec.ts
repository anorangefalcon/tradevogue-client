import { TestBed } from '@angular/core/testing';

import { EyePopupService } from './eye-popup.service';

describe('EyePopupService', () => {
  let service: EyePopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EyePopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
