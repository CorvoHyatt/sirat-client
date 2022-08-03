import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarOrdenComponent } from './registrar-orden.component';

describe('RegistrarOrdenComponent', () => {
  let component: RegistrarOrdenComponent;
  let fixture: ComponentFixture<RegistrarOrdenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarOrdenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
