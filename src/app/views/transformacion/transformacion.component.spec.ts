import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformacionComponent } from './transformacion.component';

describe('TransformacionComponent', () => {
  let component: TransformacionComponent;
  let fixture: ComponentFixture<TransformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransformacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
