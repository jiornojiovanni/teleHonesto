import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KurentoComponent } from './kurento.component';

describe('KurentoComponent', () => {
  let component: KurentoComponent;
  let fixture: ComponentFixture<KurentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KurentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KurentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
