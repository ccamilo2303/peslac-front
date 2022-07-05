import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddProductComponent } from './modal-add-product.component';

describe('ModalAddUserComponent', () => {
  let component: ModalAddProductComponent;
  let fixture: ComponentFixture<ModalAddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
