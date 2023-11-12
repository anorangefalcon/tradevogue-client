import { TestBed } from '@angular/core/testing';

import { SupportNotificationService } from './support-notification.service';

describe('SupportNotificationService', () => {
  let service: SupportNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
