import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { MeasurementRoutingModule } from './measurement-routing.module';
import { MeasurementComponent } from './measurement.component';
import { ThreedimensionalgraphComponent } from './threedimensionalgraph/threedimensionalgraph.component';
import { TwodimensionalgraphComponent } from './twodimensionalgraph/twodimensionalgraph.component';
import { ExportComponent } from './export/export.component';
import { RawdataComponent } from './rawdata/rawdata.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    MeasurementComponent,
    ThreedimensionalgraphComponent,
    TwodimensionalgraphComponent,
    ExportComponent,
    RawdataComponent
  ],
  imports: [
    CommonModule,
    MeasurementRoutingModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule
  ]
})
export class MeasurementModule { }
