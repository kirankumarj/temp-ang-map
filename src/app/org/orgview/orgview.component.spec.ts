import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgviewComponent } from './orgview.component';

describe('OrgviewComponent', () => {
  let component: OrgviewComponent;
  let fixture: ComponentFixture<OrgviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
