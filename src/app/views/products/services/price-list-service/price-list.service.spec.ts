import { TestBed } from '@angular/core/testing';

import { PriceListService } from './price-list.service';

describe('PriceListServiceService', () => {
  let service: PriceListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
