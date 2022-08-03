import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoferValidarComponent } from './chofer-validar.component';

describe('ChoferValidarComponent', () => {
  let component: ChoferValidarComponent;
  let fixture: ComponentFixture<ChoferValidarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoferValidarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoferValidarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
