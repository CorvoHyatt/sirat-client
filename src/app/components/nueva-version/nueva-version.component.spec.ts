import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaVersionComponent } from './nueva-version.component';

describe('NuevaVersionComponent', () => {
  let component: NuevaVersionComponent;
  let fixture: ComponentFixture<NuevaVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
