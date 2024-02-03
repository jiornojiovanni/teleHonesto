import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTakeoutComponent } from './data-takeout.component';

describe('DataTakeoutComponent', () => {
  let component: DataTakeoutComponent;
  let fixture: ComponentFixture<DataTakeoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTakeoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTakeoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
