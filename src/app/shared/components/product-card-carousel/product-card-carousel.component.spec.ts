import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardCarouselComponent } from './product-card-carousel.component';

describe('ProductCardCarouselComponent', () => {
  let component: ProductCardCarouselComponent;
  let fixture: ComponentFixture<ProductCardCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCardCarouselComponent]
    });
    fixture = TestBed.createComponent(ProductCardCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
