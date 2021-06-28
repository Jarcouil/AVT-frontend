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
  selectedTimestamps = [];
  dropdownSettings = {};
  selectedWavelength!: number;
  settings = {displaylogo: false, responsive: true};
  subscription: Subscription;
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

    this.dropdownSettings = {
      singleSelection: false,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: false,
      maxHeight: 500,
      noDataAvailablePlaceholderText: 'Er zijn geen tijdstippen beschikbaar'
    };

    this.subscription = measurementService.measurement$.subscribe(
      measurement => {
        this.measurement = measurement;
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
    this.getWavelengths(this.measurement.id);
    this.getTimestamps(this.measurement.id);
  }

  /**
   * Get wavelenths of given measurment
   *
   * @param name string
   *
   * @returns void
   */
  getWavelengths(id: number): void {
    this.measurementService.getWavelengths(id).subscribe(wavelengths => this.wavelengths = wavelengths);
  }

  /**
   * Get timestamps of given measurment
   *
   * @param name string
   *
   * @returns void
   */
  getTimestamps(id: number): void {
    this.measurementService.getTimestamps(id).subscribe(timestamps => this.timestamps = timestamps);
  }

  /**
   * Get all data for the graphs
   *
   * @returns void
   */
  getGraphData(): void {
    this.getTimestampsOfWavelength();
    this.getWavelengthsOfTimestamp();
  }

  /**
   * Get all timestamps data for the selected wavelength
   *
   * @returns void
   */
   getTimestampsOfWavelength(): void {
    this.twodimensionalgraphService.getTimestampsOfWavelength(this.measurement.id, this.selectedWavelength)
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
   getWavelengthsOfTimestamp(): void {
    this.twodimensionalgraphService.getWavelengthsOfTimestamp(this.measurement.id, this.selectedTimestamps)
    .subscribe(wavelengthOfTimestamp => {
        this.plotAllWavelengths(
          Object.keys(wavelengthOfTimestamp).map(x => +x),
          Object.values(wavelengthOfTimestamp),
          Object.values(wavelengthOfTimestamp).pop());
      });
  }

  /**
   * Plot all wavelenghts graph of selected timestamps
   *
   * @returns void
   */
  plotAllWavelengths(xData: Array<number>, yData: Array<Array<number>>, names: any): void {
    yData.pop();
    const data = [];

    for (let i = 0; i < Object.values(yData)[0].length; i++) {
      data.push({
        x: xData,
        y: Object.values(yData).map(items => items[i]),
        name: names[i].toString()
      });
    }

    this.allWavelengthsLayout.title = this.getTitleText();
    Plotly.newPlot('allWavelengths', data, this.allWavelengthsLayout, this.settings);
  }

  /**
   * Get title of graph based on selected timestamps
   *
   * @returns string
   */
  getTitleText(): string {
    if (this.selectedTimestamps.length > 1) {
      return `Alle golflengtes voor tijdstippen${this.selectedTimestamps.map(timestamp => ' ' + timestamp)}`;
    } else {
      return `Alle golflengtes voor tijdstip ${this.selectedTimestamps[0]}`;
    }
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
