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

  setMeasurement(measurement: Measurement): void{
    this.measurementSubject.next(measurement);
  }
}
