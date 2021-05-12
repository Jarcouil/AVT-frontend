import { Measurement } from './../../measurement-overview/measurement';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesService } from 'src/app/shared/messages/messages.service';
import { TwodimensionalgraphService } from './service/twodimensionalgraph.service';
import { MeasurementService } from '../service/measurement.service';
import { Subscription } from 'rxjs';

import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

declare var Plotly: any;

@Component({
  selector: 'app-twodimensionalgraph',
  templateUrl: './twodimensionalgraph.component.html',
  styleUrls: ['./twodimensionalgraph.component.css']
})
export class TwodimensionalgraphComponent implements OnInit, OnDestroy {
  ids: number[] = [];
  measurement!: Measurement;
  selectedTimestamp!: number;
  selectedWavelength!: number;
  showGraph1 = false;
  showGraph2 = false;
  subscription: Subscription;
  tableName!: string;
  wavelengths: number[] = [];

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Alle tijdstippen voor één golflengte' },
  ];

  lineChartLabels: Label[] = [];

  lineChartData2: ChartDataSets[] = [
    { data: [], label: 'Alle golflengtes voor één tijdstip' },
  ];

  lineChartLabels2: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType: ChartType = 'line';

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
   * Get ranges of wavelengths and getIds of current measurement
   *
   * @returns void
   */
  getRanges(): void {
    this.getWavelengths(this.tableName);
    this.getIds(this.tableName);
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
   * Get ids of given measurment
   *
   * @param name string
   *
   * @returns void
   */
  getIds(name: string): void {
    this.measurementService.getAllIds(name).subscribe(ids => this.ids = ids);
  }

  /**
   * Get all data for the graphs
   *
   * @returns void
   */
  getGraphData(): void {
    this.getAllIdOfWavelength();
    this.getAllWavelengthsOfId();
  }

  /**
   * Get all ids data for the selected wavelength
   *
   * @returns void
   */
  getAllIdOfWavelength(): void {
    this.twodimensionalgraphService.getAllIdOfWavelength(this.tableName, this.selectedWavelength)
      .subscribe(wavelengthsOfId => {
        this.showGraph1 = true;
        this.lineChartLabels = wavelengthsOfId.map(wavelengthOfId => wavelengthOfId.id.toString());
        this.lineChartData[0].data = wavelengthsOfId.map(wavelengthOfId => wavelengthOfId.wavelength);
      });
  }

  /**
   * Get all wavelengths data for the selected id/timestamp
   *
   * @returns void
   */
  getAllWavelengthsOfId(): void {
    this.twodimensionalgraphService.getAllWavelengthsOfId(this.tableName, this.selectedTimestamp)
      .subscribe(wavelengthsOfId => {
        this.showGraph2 = true;
        this.lineChartLabels2 = Object.keys(wavelengthsOfId);
        this.lineChartData2[0].data = Object.values(wavelengthsOfId);
      });
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

export interface WavelengthsOfId {
  id: number;
  wavelength: number;
}
