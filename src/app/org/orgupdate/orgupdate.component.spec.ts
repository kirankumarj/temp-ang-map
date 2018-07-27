import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgupdateComponent } from './orgupdate.component';

describe('OrgupdateComponent', () => {
  let component: OrgupdateComponent;
  let fixture: ComponentFixture<OrgupdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgupdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
