import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLineComponent } from './modal-line.component';

describe('ModalGroupComponent', () => {
  let component: ModalLineComponent;
  let fixture: ComponentFixture<ModalLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
