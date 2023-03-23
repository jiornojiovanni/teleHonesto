import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideocallPJComponent } from './videocall-pj.component';

describe('VideocallPJComponent', () => {
  let component: VideocallPJComponent;
  let fixture: ComponentFixture<VideocallPJComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideocallPJComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideocallPJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
