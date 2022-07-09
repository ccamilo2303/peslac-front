import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDevolucionComponent } from './modal-devolucion.component';

describe('ModalDevolucionComponent', () => {
  let component: ModalDevolucionComponent;
  let fixture: ComponentFixture<ModalDevolucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDevolucionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDevolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
