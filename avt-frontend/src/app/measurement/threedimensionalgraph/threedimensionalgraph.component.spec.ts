import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreedimensionalgraphComponent } from './threedimensionalgraph.component';

describe('ThreedimensionalgraphComponent', () => {
  let component: ThreedimensionalgraphComponent;
  let fixture: ComponentFixture<ThreedimensionalgraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreedimensionalgraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreedimensionalgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
