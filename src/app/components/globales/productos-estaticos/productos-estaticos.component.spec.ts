import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosEstaticosComponent } from './productos-estaticos.component';

describe('ProductosEstaticosComponent', () => {
  let component: ProductosEstaticosComponent;
  let fixture: ComponentFixture<ProductosEstaticosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosEstaticosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosEstaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
