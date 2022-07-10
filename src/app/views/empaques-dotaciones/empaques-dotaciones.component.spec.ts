import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpaquesDotacionesComponent } from './empaques-dotaciones.component';

describe('EmpaquesDotacionesComponent', () => {
  let component: EmpaquesDotacionesComponent;
  let fixture: ComponentFixture<EmpaquesDotacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpaquesDotacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpaquesDotacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
