import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursPrivadosEntransporteComponent } from './tours-privados-entransporte.component';

describe('ToursPrivadosEntransporteComponent', () => {
  let component: ToursPrivadosEntransporteComponent;
  let fixture: ComponentFixture<ToursPrivadosEntransporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToursPrivadosEntransporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToursPrivadosEntransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
