import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeasurementRoutingModule } from './measurement-routing.module';
import { MeasurementComponent } from './measurement.component';
import { ThreedimensionalgraphComponent } from './threedimensionalgraph/threedimensionalgraph.component';


@NgModule({
  declarations: [MeasurementComponent, ThreedimensionalgraphComponent],
  imports: [
    CommonModule,
    MeasurementRoutingModule
  ]
})
export class MeasurementModule { }
