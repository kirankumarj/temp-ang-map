import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayDeleteComponent } from './overlay-delete.component';

describe('OverlayDeleteComponent', () => {
  let component: OverlayDeleteComponent;
  let fixture: ComponentFixture<OverlayDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlayDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
