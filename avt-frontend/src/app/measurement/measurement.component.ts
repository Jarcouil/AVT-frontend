import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Measurement } from '../measurement-overview/measurement';
import { MeasurementOverviewService } from '../measurement-overview/service/measurement-overview.service';

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.css']
})
export class MeasurementComponent implements OnInit {

  public measurement: Measurement = { id: 0, name: 'naam', description: 'beschrijving', created_at: '10-11-2000' };

  constructor(
    private measurementOverviewService: MeasurementOverviewService,
    private route: ActivatedRoute

  ) { }


  ngOnInit(): void {
    this.getMeasurement();
  }

  getMeasurement(): void {
    const id = +(this.route.snapshot.paramMap.get('id') || 0);


    this.measurementOverviewService.getMeasurement(id)
      .subscribe(measurement => this.measurement = measurement[0]);

  }
}
