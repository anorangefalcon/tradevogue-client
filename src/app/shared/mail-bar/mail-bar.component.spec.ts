import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailBarComponent } from './mail-bar.component';

describe('MailBarComponent', () => {
  let component: MailBarComponent;
  let fixture: ComponentFixture<MailBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MailBarComponent]
    });
    fixture = TestBed.createComponent(MailBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
