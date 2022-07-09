import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAnularCompraComponent } from './modal-anular-compra.component';

describe('ModalAnularCompraComponent', () => {
  let component: ModalAnularCompraComponent;
  let fixture: ComponentFixture<ModalAnularCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAnularCompraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAnularCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
