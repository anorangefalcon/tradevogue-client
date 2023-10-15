import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartcontentComponent } from './cartcontent.component';

describe('CartcontentComponent', () => {
  let component: CartcontentComponent;
  let fixture: ComponentFixture<CartcontentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CartcontentComponent]
    });
    fixture = TestBed.createComponent(CartcontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
