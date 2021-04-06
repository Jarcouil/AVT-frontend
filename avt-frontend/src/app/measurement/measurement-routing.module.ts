import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeasurementComponent } from './measurement.component';

const routes: Routes = [
  {
    path: 'measurement', component: MeasurementComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeasurementRoutingModule { }
