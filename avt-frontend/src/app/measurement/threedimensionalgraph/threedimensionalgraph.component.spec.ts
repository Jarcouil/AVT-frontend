import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ThreedimensionalgraphComponent } from './threedimensionalgraph.component';

describe('ThreedimensionalgraphComponent', () => {
  let component: ThreedimensionalgraphComponent;
  let fixture: ComponentFixture<ThreedimensionalgraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreedimensionalgraphComponent ],
      imports: [ 
        HttpClientModule,
     ]
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
