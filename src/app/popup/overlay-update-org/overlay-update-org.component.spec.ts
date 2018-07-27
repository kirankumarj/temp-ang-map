import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayUpdateOrgComponent } from './overlay-update-org.component';

describe('OverlayUpdateOrgComponent', () => {
  let component: OverlayUpdateOrgComponent;
  let fixture: ComponentFixture<OverlayUpdateOrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlayUpdateOrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayUpdateOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
