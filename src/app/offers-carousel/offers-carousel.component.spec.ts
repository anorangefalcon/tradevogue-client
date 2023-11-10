import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersCarouselComponent } from './offers-carousel.component';

describe('OffersCarouselComponent', () => {
  let component: OffersCarouselComponent;
  let fixture: ComponentFixture<OffersCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OffersCarouselComponent]
    });
    fixture = TestBed.createComponent(OffersCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
