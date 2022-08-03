import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanastaComponent } from './canasta.component';

describe('CanastaComponent', () => {
  let component: CanastaComponent;
  let fixture: ComponentFixture<CanastaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanastaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanastaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
