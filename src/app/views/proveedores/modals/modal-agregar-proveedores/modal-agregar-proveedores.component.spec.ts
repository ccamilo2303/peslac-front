import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarProveedoresComponent } from '../modal-agregar-proveedores/modal-agregar-proveedores.component';

describe('ModalAddUserComponent', () => {
  let component: ModalAgregarProveedoresComponent;
  let fixture: ComponentFixture<ModalAgregarProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarProveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAgregarProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
