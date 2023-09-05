import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealOfWeekComponent } from './deal-of-week.component';

describe('DealOfWeekComponent', () => {
  let component: DealOfWeekComponent;
  let fixture: ComponentFixture<DealOfWeekComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealOfWeekComponent]
    });
    fixture = TestBed.createComponent(DealOfWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
