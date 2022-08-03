import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursPrivadosApieComponent } from './tours-privados-apie.component';

describe('ToursPrivadosApieComponent', () => {
  let component: ToursPrivadosApieComponent;
  let fixture: ComponentFixture<ToursPrivadosApieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToursPrivadosApieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToursPrivadosApieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
