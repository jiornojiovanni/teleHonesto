import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificDocumentListComponent } from './specific-document-list.component';

describe('SpecificDocumentListComponent', () => {
  let component: SpecificDocumentListComponent;
  let fixture: ComponentFixture<SpecificDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecificDocumentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecificDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
