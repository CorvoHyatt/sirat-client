import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletarCotizacionComponent } from './completar-cotizacion.component';

describe('CompletarCotizacionComponent', () => {
  let component: CompletarCotizacionComponent;
  let fixture: ComponentFixture<CompletarCotizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletarCotizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletarCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
