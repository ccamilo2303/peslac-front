import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPriceListComponent } from './modal-price-list.component';

describe('ModalPriceListComponent', () => {
  let component: ModalPriceListComponent;
  let fixture: ComponentFixture<ModalPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPriceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
