import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementOverviewComponent } from './measurement-overview.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [MeasurementOverviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class MeasurementOverviewModule { }
