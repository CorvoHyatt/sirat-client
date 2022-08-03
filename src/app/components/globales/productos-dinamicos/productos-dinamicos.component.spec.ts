import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosDinamicosComponent } from './productos-dinamicos.component';

describe('ProductosDinamicosComponent', () => {
  let component: ProductosDinamicosComponent;
  let fixture: ComponentFixture<ProductosDinamicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosDinamicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosDinamicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
