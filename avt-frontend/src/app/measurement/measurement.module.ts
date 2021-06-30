import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { MeasurementRoutingModule } from './measurement-routing.module';
import { MeasurementComponent } from './measurement.component';
import { ThreedimensionalgraphComponent } from './threedimensionalgraph/threedimensionalgraph.component';
import { TwodimensionalgraphComponent } from './twodimensionalgraph/twodimensionalgraph.component';
import { ExportComponent } from './export/export.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  declarations: [
    MeasurementComponent,
    ThreedimensionalgraphComponent,
    TwodimensionalgraphComponent,
    ExportComponent,
  ],
  imports: [
    AngularMultiSelectModule,
    CommonModule,
    MeasurementRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MeasurementModule { }
