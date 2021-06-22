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
  allMeasurments = false;
  measurements: Measurement[] = [];

  sorting = {
    id: 'id',
    name: 'name',
    description: 'description',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
  };

  orders = {
    asc: 'asc',
    desc: 'desc',
  };

  sort = this.sorting.id;
  order = this.orders.asc;

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
    this.getAllMeasurementsOfUser();
    this.messagesService.clear();
  }

  /**
   * Sort measurements by selected item
   *
   * @param sortBy string
   * @returns void
   */
  sortMeasurements(sortBy: string): void {
    if (this.sort !== sortBy) {
      this.sort = sortBy;
    } else {
      this.toggleOrder();
    }
    this.getMeasurements();
  }

  /**
   * Toggle order by
   *
   * @returns void
   */
  toggleOrder(): void {
    this.order = (this.order === this.orders.asc) ? this.orders.desc : this.orders.asc;
  }

  /**
   * getMeasurements on option selected
   *
   * @params option
   *
   * @returns void
   */
  getMeasurements(): void {
    if (this.allMeasurments) {
      this.getAllMeasurements();
    } else {
      this.getAllMeasurementsOfUser();
    }
  }

  /**
   * Get all measuremnts
   *
   * @returns void
   */
  getAllMeasurementsOfUser(): void {
    this.measurementOverviewService.getAllMeasurementsOfUser(this.sort, this.order)
      .subscribe(measurements => this.measurements = measurements);
  }

  /**
   * Get all measuremnts
   *
   * @returns void
   */
  getAllMeasurements(): void {
    this.measurementOverviewService.getAllMeasurements(this.sort, this.order).subscribe(measurements => this.measurements = measurements);
  }

  /**
   * Delete measurment of given id and retreive measurements again
   *
   * @param measurement Measurement
   *
   * @returns void
   */
  deleteMeasurement(measurement: Measurement): void {
    if (confirm(`Weet je zeker dat je meting ${measurement.name} wilt verwijderen?`)) {
      this.measurementOverviewService.deleteMeasurement(measurement.id).subscribe(result => {
        this.getAllMeasurementsOfUser();
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
