import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwodimensionalgraphComponent } from './twodimensionalgraph.component';

describe('TwodimensionalgraphComponent', () => {
  let component: TwodimensionalgraphComponent;
  let fixture: ComponentFixture<TwodimensionalgraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwodimensionalgraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwodimensionalgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
