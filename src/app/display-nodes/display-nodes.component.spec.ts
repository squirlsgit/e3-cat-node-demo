import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayNodesComponent } from './display-nodes.component';

describe('DisplayNodesComponent', () => {
  let component: DisplayNodesComponent;
  let fixture: ComponentFixture<DisplayNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayNodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
