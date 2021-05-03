import { Measurement } from './measurement';
import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../shared/messages/messages.service';
import { AuthService } from '../shared/services/auth.service';
import { MeasurementOverviewService } from './service/measurement-overview.service';

@Component({
  selector: 'app-measurement-overview',
  templateUrl: './measurement-overview.component.html',
  styleUrls: ['./measurement-overview.component.css']
})
export class MeasurementOverviewComponent implements OnInit {

  measurements: Measurement[] = [];

  constructor(
    private measurementOverviewService: MeasurementOverviewService,
    private auth: AuthService,
    private messagesService: MessagesService
  ) { }

  /**
   * On init
   *
   * @returns void
   */
  ngOnInit(): void {
    this.getMeasurements();
    this.messagesService.clear();
  }

  /**
   * Get all measuremnts
   *
   * @returns void
   */
  getMeasurements(): void {
    this.measurementOverviewService.getAllMeasurements().subscribe(measurements => this.measurements = measurements);
  }

  /**
   * Delete measurment of given id and retreive measurements again
   *
   * @param measurement Measurement
   *
   * @returns void
   */
  deleteMeasurement(measurement: Measurement): void {
    if (confirm('Weet je zeker dat je meting ' + measurement.name + ' wilt verwijderen?')) {
      this.measurementOverviewService.deleteMeasurement(measurement.id).subscribe(result => {
        this.getMeasurements();
      });
    }
  }

  /**
   * check if user in storage is admin
   *
   * @returns boolean
   */
   isAdmin(): boolean {
    return this.auth.isCurrentUserAdmin();
  }
}
