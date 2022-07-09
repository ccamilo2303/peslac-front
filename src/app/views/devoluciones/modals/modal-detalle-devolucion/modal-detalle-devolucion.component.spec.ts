import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleDevolucionComponent } from './modal-detalle-devolucion.component';

describe('ModalDetalleDevolucionComponent', () => {
  let component: ModalDetalleDevolucionComponent;
  let fixture: ComponentFixture<ModalDetalleDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetalleDevolucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetalleDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
