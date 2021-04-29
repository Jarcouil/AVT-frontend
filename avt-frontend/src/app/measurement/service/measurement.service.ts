import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Measurement } from '../../measurement-overview/measurement';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private measurementSubject = new ReplaySubject<Measurement>();

  measurement$ = this.measurementSubject.asObservable();

  constructor(
  ) { }

  /**
   * Set measurement
   *
   * @param measurement Measurement
   *
   * @returns void
   */
  setMeasurement(measurement: Measurement): void{
    this.measurementSubject.next(measurement);
  }
}
