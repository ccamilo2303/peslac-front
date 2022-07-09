import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAnuladosComponent } from './historial-anulados.component';

describe('HistorialAnuladosComponent', () => {
  let component: HistorialAnuladosComponent;
  let fixture: ComponentFixture<HistorialAnuladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialAnuladosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialAnuladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
