import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPackageComponent } from './modal-package.component';

describe('ModalPackageComponent', () => {
  let component: ModalPackageComponent;
  let fixture: ComponentFixture<ModalPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
