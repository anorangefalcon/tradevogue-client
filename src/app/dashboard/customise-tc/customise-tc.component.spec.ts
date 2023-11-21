import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomiseTcComponent } from './customise-tc.component';

describe('CustomiseTcComponent', () => {
  let component: CustomiseTcComponent;
  let fixture: ComponentFixture<CustomiseTcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomiseTcComponent]
    });
    fixture = TestBed.createComponent(CustomiseTcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
