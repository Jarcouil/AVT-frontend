import { Component, OnInit } from '@angular/core';
import { Measurement } from '../measurement-overview/measurement';
import { MeasurementService } from './service/measurement.service';

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html',
  styleUrls: ['./measurement.component.css']
})
export class MeasurementComponent implements OnInit {

  measurement: Measurement = {id: 1, name: "Meting 1", description: "beschrijving", created_at: '10-11-2000'};

  constructor(
    private measurementService: MeasurementService,
  ) { }

  ngOnInit(): void {
  }



}
