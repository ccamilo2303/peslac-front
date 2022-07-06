import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarDevolucionComponent } from './modal-agregar-devolucion.component';

describe('ModalAgregarDevolucionComponent', () => {
  let component: ModalAgregarDevolucionComponent;
  let fixture: ComponentFixture<ModalAgregarDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarDevolucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAgregarDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
