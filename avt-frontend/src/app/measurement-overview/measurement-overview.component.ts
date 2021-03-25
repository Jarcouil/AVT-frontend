import { Component, OnInit } from '@angular/core';
import { Measurement } from './measurement';
import { MeasurementOverviewService } from './service/measurement-overview.service';

@Component({
  selector: 'app-measurement-overview',
  templateUrl: './measurement-overview.component.html',
  styleUrls: ['./measurement-overview.component.css']
})
export class MeasurementOverviewComponent implements OnInit {

  measurements: Measurement[] = [];

  constructor(private measurementOverviewService: MeasurementOverviewService) { }

  ngOnInit(): void {
    this.getMeasurements()
  }

  getMeasurements(): void {
    this.measurementOverviewService.getAllMeasurements().subscribe(measurements => this.measurements = measurements);
  }

}
