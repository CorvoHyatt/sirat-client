import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechazarComponent } from './rechazar.component';

describe('RechazarComponent', () => {
  let component: RechazarComponent;
  let fixture: ComponentFixture<RechazarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RechazarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechazarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
