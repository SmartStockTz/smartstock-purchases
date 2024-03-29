import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchasePageComponent } from '../pages/purchase.page';

describe('PurchaseComponent', () => {
  let component: PurchasePageComponent;
  let fixture: ComponentFixture<PurchasePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
