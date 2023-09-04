import { TestBed } from '@angular/core/testing';

import { SellerFetchDataService } from './seller-fetch-data.service';

describe('SellerFetchDataService', () => {
  let service: SellerFetchDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerFetchDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
