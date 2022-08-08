import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBalanzaComponent } from './modal-balanza.component';

describe('ModalBalanzaComponent', () => {
  let component: ModalBalanzaComponent;
  let fixture: ComponentFixture<ModalBalanzaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalBalanzaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBalanzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
