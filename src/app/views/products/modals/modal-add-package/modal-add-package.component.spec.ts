import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPackageComponent } from './modal-add-package.component';

describe('ModalAddPackageComponent', () => {
  let component: ModalAddPackageComponent;
  let fixture: ComponentFixture<ModalAddPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddPackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
