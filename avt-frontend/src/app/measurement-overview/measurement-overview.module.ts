import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementOverviewComponent } from './measurement-overview.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MeasurementOverviewComponent],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class MeasurementOverviewModule { }
