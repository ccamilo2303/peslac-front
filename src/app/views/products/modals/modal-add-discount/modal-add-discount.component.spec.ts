import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddDiscountComponent } from './modal-add-discount.component';

describe('ModalAddDiscountComponent', () => {
  let component: ModalAddDiscountComponent;
  let fixture: ComponentFixture<ModalAddDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddDiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
