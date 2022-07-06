import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarSalidaComponent } from './modal-agregar-salida.component';

describe('ModalAgregarSalidaComponent', () => {
  let component: ModalAgregarSalidaComponent;
  let fixture: ComponentFixture<ModalAgregarSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarSalidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAgregarSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
