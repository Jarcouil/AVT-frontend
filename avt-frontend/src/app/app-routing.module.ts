import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeasurementOverviewComponent } from './measurement-overview/measurement-overview.component';
import { ExportComponent } from './measurement/export/export.component';
import { MeasurementComponent } from './measurement/measurement.component';
import { RawdataComponent } from './measurement/rawdata/rawdata.component';
import { ThreedimensionalgraphComponent } from './measurement/threedimensionalgraph/threedimensionalgraph.component';
import { TwodimensionalgraphComponent } from './measurement/twodimensionalgraph/twodimensionalgraph.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: 'measurements/:id', component: MeasurementComponent,
    children: [
      { path: '3dgraph', component: ThreedimensionalgraphComponent },
      { path: '2dgraph', component: TwodimensionalgraphComponent },
      { path: 'all', component: RawdataComponent },
      { path: 'export', component: ExportComponent }
    ]
  },
  { path: 'measurements', component: MeasurementOverviewComponent },
  { path: 'upload', component: UploadComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
