import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenteComprasComponent } from './gerente-compras.component';

describe('GerenteComprasComponent', () => {
  let component: GerenteComprasComponent;
  let fixture: ComponentFixture<GerenteComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerenteComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenteComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
