import { Measurement, MeasurementResponse } from './measurement';
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
  page = 0;
  perPage = 10;
  total = 0;

  constructor(
    private measurementOverviewService: MeasurementOverviewService,
    private auth: AuthService,
    private messagesService: MessagesService,
  ) { }

  /**
   * On init
   *
   * @returns void
   */
  ngOnInit(): void {
    this.getMeasurementsOfUser(this.page);
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
    this.refreshMeasurements(this.page);
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
   * refreshMeasurements on option selected
   *
   * @params option
   *
   * @returns void
   */
  refreshMeasurements(page: any): void {
    if (this.allMeasurments) {
      this.getMeasurements(page);
    } else {
      this.getMeasurementsOfUser(page);
    }
  }

  /**
   * Get all measuremnts
   *
   * @returns void
   */
  getMeasurementsOfUser(page: any): void {
    this.measurementOverviewService.getMeasurementsOfUser(this.sort, this.order, page, this.perPage)
    .subscribe(response => this.processResponse(response));
  }

  /**
   * Get all measuremnts
   *
   * @returns void
   */
  getMeasurements(page: any): void {
    this.measurementOverviewService.getMeasurements(this.sort, this.order, page, this.perPage)
      .subscribe(response => this.processResponse(response));
  }

  /**
   * Process response of getting measurements
   * @param response MeasurementResponse
   */
  processResponse(response: MeasurementResponse): void {
    this.measurements = response.data;
    this.page = +response.pagination.currentPage;
    this.total = +response.pagination.total;
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
        this.refreshMeasurements(this.page);
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
