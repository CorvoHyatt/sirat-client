import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosVentaComponent } from './productos-venta.component';

describe('ProductosVentaComponent', () => {
  let component: ProductosVentaComponent;
  let fixture: ComponentFixture<ProductosVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
