import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposicionesComponent } from './disposiciones.component';

describe('DisposicionesComponent', () => {
  let component: DisposicionesComponent;
  let fixture: ComponentFixture<DisposicionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisposicionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisposicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
