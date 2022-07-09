import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDevolucionCompraComponent } from './modal-devolucion-compra.component';

describe('ModalDevolucionCompraComponent', () => {
  let component: ModalDevolucionCompraComponent;
  let fixture: ComponentFixture<ModalDevolucionCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDevolucionCompraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDevolucionCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
