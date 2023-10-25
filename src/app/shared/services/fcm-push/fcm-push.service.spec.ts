import { TestBed } from '@angular/core/testing';

import { FcmPushService } from './fcm-push.service';

describe('FcmPushService', () => {
  let service: FcmPushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FcmPushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
