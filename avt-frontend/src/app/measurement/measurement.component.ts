import { Measurement } from './../measurement-overview/measurement';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeasurementOverviewService } from '../measurement-overview/service/measurement-overview.service';
import { MeasurementService } from './service/measurement.service';

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.css']
})
export class MeasurementComponent implements OnInit {

  public measurement!: Measurement;

  constructor(
    private measurementOverviewService: MeasurementOverviewService,
    private route: ActivatedRoute,
    private measurementService: MeasurementService
  ) { }


  ngOnInit(): void {
    this.getMeasurement();
  }

  getMeasurement(): void {
    const id = +(this.route.snapshot.paramMap.get('id') || 0);

    this.measurementOverviewService.getMeasurement(id)
      .subscribe(measurement => {
        this.measurement = measurement[0];
        this.setMeasurement();
      });
  }

  setMeasurement(): void {
    this.measurementService.setMeasurement(this.measurement);
  }
}
