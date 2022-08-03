import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesadoComponent } from './procesado.component';

describe('ProcesadoComponent', () => {
  let component: ProcesadoComponent;
  let fixture: ComponentFixture<ProcesadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
