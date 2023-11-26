import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyePopupComponent } from './eye-popup.component';

describe('EyePopupComponent', () => {
  let component: EyePopupComponent;
  let fixture: ComponentFixture<EyePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EyePopupComponent]
    });
    fixture = TestBed.createComponent(EyePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
