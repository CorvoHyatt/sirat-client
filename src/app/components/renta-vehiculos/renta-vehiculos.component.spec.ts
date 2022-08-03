import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentaVehiculosComponent } from './renta-vehiculos.component';

describe('RentaVehiculosComponent', () => {
  let component: RentaVehiculosComponent;
  let fixture: ComponentFixture<RentaVehiculosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentaVehiculosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentaVehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
