import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarClientesComponent } from '../modal-agregar-clientes/modal-agregar-clientes.component';

describe('ModalAddUserComponent', () => {
  let component: ModalAgregarClientesComponent;
  let fixture: ComponentFixture<ModalAgregarClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarClientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAgregarClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
