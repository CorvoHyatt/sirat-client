import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrenesComponent } from './trenes.component';

describe('TrenesComponent', () => {
  let component: TrenesComponent;
  let fixture: ComponentFixture<TrenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
