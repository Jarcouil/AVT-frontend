import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementOverviewComponent } from './measurement-overview.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [MeasurementOverviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule
  ]
})
export class MeasurementOverviewModule { }
