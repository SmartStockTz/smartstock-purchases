import { TestBed } from '@angular/core/testing';

import { PurchaseState } from '../states/purchase.state';

describe('PurchaseDatabaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseState = TestBed.get(PurchaseState);
    expect(service).toBeTruthy();
  });
});
