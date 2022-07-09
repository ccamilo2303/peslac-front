import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarTransformacionComponent } from './modal-agregar-transformacion.component';

describe('ModalAgregarTransformacionComponent', () => {
  let component: ModalAgregarTransformacionComponent;
  let fixture: ComponentFixture<ModalAgregarTransformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAgregarTransformacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAgregarTransformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
