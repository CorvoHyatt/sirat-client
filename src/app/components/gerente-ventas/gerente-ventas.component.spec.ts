import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenteVentasComponent } from './gerente-ventas.component';

describe('GerenteVentasComponent', () => {
  let component: GerenteVentasComponent;
  let fixture: ComponentFixture<GerenteVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerenteVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenteVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
