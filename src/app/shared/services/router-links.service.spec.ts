import { TestBed } from '@angular/core/testing';

import { RouterLinksService } from './router-links.service';

describe('RouterLinksService', () => {
  let service: RouterLinksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouterLinksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
