import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportComponent } from './export/export.component';
import { MeasurementComponent } from './measurement.component';
import { RawdataComponent } from './rawdata/rawdata.component';
import { ThreedimensionalgraphComponent } from './threedimensionalgraph/threedimensionalgraph.component';

const routes: Routes = [
  {
    path: 'measurement', component: MeasurementComponent,
    children: [
      { path: '3dgraph', component: ThreedimensionalgraphComponent },
      { path: '2dgraph', component: ThreedimensionalgraphComponent },
      { path: 'all', component: RawdataComponent },
      { path: 'export', component: ExportComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeasurementRoutingModule { }
