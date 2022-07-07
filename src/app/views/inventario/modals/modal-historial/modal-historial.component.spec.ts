import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHistorialComponent } from './modal-historial.component';

describe('ModalAddUserComponent', () => {
  let component: ModalHistorialComponent;
  let fixture: ComponentFixture<ModalHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalHistorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
