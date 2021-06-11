import { Measurement } from './../../measurement-overview/measurement';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesService } from 'src/app/shared/messages/messages.service';
import { TwodimensionalgraphService } from './service/twodimensionalgraph.service';
import { MeasurementService } from '../service/measurement.service';
import { Subscription } from 'rxjs';

declare var Plotly: any;

@Component({
  selector: 'app-twodimensionalgraph',
  templateUrl: './twodimensionalgraph.component.html',
  styleUrls: ['./twodimensionalgraph.component.css']
})
export class TwodimensionalgraphComponent implements OnInit, OnDestroy {
  timestamps: number[] = [];
  measurement!: Measurement;
  selectedTimestamp!: number;
  selectedWavelength!: number;
  settings = {displaylogo: false, responsive: true};
  subscription: Subscription;
  tableName!: string;
  wavelengths: number[] = [];

  allWavelengthsLayout = {
    autoexpand: 'true',
    automargin: true,
    title: 'Alle golflengtes per tijdstip',
    xaxis: {
      title: 'Golflengte',
    },
    yaxis: {
      title: 'Absorptie',
    }
  };

  allTimestampsLayout = {
    autoexpand: 'true',
    title: 'Alle tijdstippen per golflengte',
    automargin: true,
    xaxis: {
      title: 'Tijdstip',
    },
    yaxis: {
      title: 'Absorptie',
    }
  };

  constructor(
    private twodimensionalgraphService: TwodimensionalgraphService,
    private messagesService: MessagesService,
    private measurementService: MeasurementService,
  ) {

    this.subscription = measurementService.measurement$.subscribe(
      measurement => {
        this.measurement = measurement;
        this.tableName = measurement.id.toString() + '_' + measurement.name;
        this.getRanges();
      }
    );
  }

  /**
   * On init
   *
   * @returns void
   */
  ngOnInit(): void {
    this.messagesService.clear();
  }

  /**
   * Get ranges of wavelengths and timestamps of current measurement
   *
   * @returns void
   */
  getRanges(): void {
    this.getWavelengths(this.tableName);
    this.getTimestamps(this.tableName);
  }

  /**
   * Get wavelenths of given measurment
   *
   * @param name string
   *
   * @returns void
   */
  getWavelengths(name: string): void {
    this.measurementService.getAllWavelengths(name).subscribe(wavelengths => this.wavelengths = wavelengths);
  }

  /**
   * Get timestamps of given measurment
   *
   * @param name string
   *
   * @returns void
   */
  getTimestamps(name: string): void {
    this.measurementService.getAllTimestamps(name).subscribe(timestamps => this.timestamps = timestamps);
  }

  /**
   * Get all data for the graphs
   *
   * @returns void
   */
  getGraphData(): void {
    this.getAllTimestampsOfWavelength();
    this.getAllWavelengthsOfTimestamp();
  }

  /**
   * Get all timestamps data for the selected wavelength
   *
   * @returns void
   */
   getAllTimestampsOfWavelength(): void {
    this.twodimensionalgraphService.getAllTimestampsOfWavelength(this.tableName, this.selectedWavelength)
      .subscribe(timestampsOfIdAndWavelength => {
        this.plotAllTimestamps(
          Object.keys(timestampsOfIdAndWavelength).map(x => +x),
          Object.values(timestampsOfIdAndWavelength).map(x => x.wavelength));
      });
  }

  /**
   * Get all wavelengths data for the selected timestamp
   *
   * @returns void
   */
   getAllWavelengthsOfTimestamp(): void {
    this.twodimensionalgraphService.getAllWavelengthsOfTimestamp(this.tableName, this.selectedTimestamp)
      .subscribe(wavelengthOfTimestamp => {
        this.plotAllWavelengths(Object.keys(wavelengthOfTimestamp).map(x => +x), Object.values(wavelengthOfTimestamp));
      });
  }

  /**
   * Plot all wavelenghts graph
   *
   * @returns void
   */
  plotAllWavelengths(xData: Array<number>, yData: Array<number>): void {
    const data = [{ x: xData, y: yData}];
    this.allWavelengthsLayout.title = `Alle golflengtes voor tijdstip ${this.selectedTimestamp}`;
    Plotly.newPlot('allWavelengths', data, this.allWavelengthsLayout, this.settings);
  }

  /**
   * Plot all timestamps graph
   *
   * @returns void
   */
  plotAllTimestamps(xData: Array<number>, yData: Array<number>): void {
    const data = [{ x: xData, y: yData}];
    this.allTimestampsLayout.title = `Alle tijdstippen voor golflengte ${this.selectedWavelength}`;
    Plotly.newPlot('allTimestamps', data, this.allTimestampsLayout, this.settings);
  }

  /**
   * On destory
   *
   * @returns void
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

export interface WavelengthsOfTimestamp {
  timestamp: number;
  wavelength: number;
}
