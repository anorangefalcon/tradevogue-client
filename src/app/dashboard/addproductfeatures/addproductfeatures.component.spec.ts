import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddproductfeaturesComponent } from './addproductfeatures.component';

describe('AddproductfeaturesComponent', () => {
  let component: AddproductfeaturesComponent;
  let fixture: ComponentFixture<AddproductfeaturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddproductfeaturesComponent]
    });
    fixture = TestBed.createComponent(AddproductfeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
