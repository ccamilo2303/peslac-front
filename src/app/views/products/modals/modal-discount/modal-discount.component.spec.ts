import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDiscountComponent } from './modal-discount.component';

describe('ModalDiscountComponent', () => {
  let component: ModalDiscountComponent;
  let fixture: ComponentFixture<ModalDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
