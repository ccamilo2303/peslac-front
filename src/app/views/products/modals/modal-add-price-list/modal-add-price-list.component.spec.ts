import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPriceListComponent } from './modal-add-price-list.component';

describe('ModalAddPriceListComponent', () => {
  let component: ModalAddPriceListComponent;
  let fixture: ComponentFixture<ModalAddPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddPriceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
