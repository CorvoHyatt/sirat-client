import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechazarOrdenComponent } from './rechazar-orden.component';

describe('RechazarOrdenComponent', () => {
  let component: RechazarOrdenComponent;
  let fixture: ComponentFixture<RechazarOrdenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechazarOrdenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechazarOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
