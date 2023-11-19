import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomiseBannerComponent } from './customise-banner.component';

describe('CustomiseBannerComponent', () => {
  let component: CustomiseBannerComponent;
  let fixture: ComponentFixture<CustomiseBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomiseBannerComponent]
    });
    fixture = TestBed.createComponent(CustomiseBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
