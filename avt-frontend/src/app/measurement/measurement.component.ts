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

  /**
   * On init
   *
   * @returns void
   */
  ngOnInit(): void {
    this.getMeasurement();
  }

  /**
   * Get current measurement from overview service
   *
   * @returns void
   */
  getMeasurement(): void {
    const id = +(this.route.snapshot.paramMap.get('id') || 0);

    this.measurementOverviewService.getMeasurement(id)
      .subscribe(measurement => this.setMeasurement(measurement));
  }

  /**
   * Set current measurement
   *
   * @param measurement Measurment
   *
   * @returns void
   */
  setMeasurement(measurement: Measurement): void {
    this.measurement = measurement;
    this.measurementService.setMeasurement(measurement);
  }
}
