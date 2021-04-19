import { Measurement } from './../../measurement-overview/measurement';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesService } from 'src/app/shared/messages/messages.service';
import { TwodimensionalgraphService } from './service/twodimensionalgraph.service';
import { MeasurementService } from '../service/measurement.service';
import { Subscription } from 'rxjs';

import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-twodimensionalgraph',
  templateUrl: './twodimensionalgraph.component.html',
  styleUrls: ['./twodimensionalgraph.component.css']
})
export class TwodimensionalgraphComponent implements OnInit, OnDestroy {
  measurement!: Measurement;
  wavelengths: number[] = [];
  ids: number[] = [];
  subscription: Subscription;
  showGraph1 = false;
  showGraph2 = false;

  selectedWavelength!: number;
  selectedTimestamp!: number;

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
        this.getItems();
      }
    );
  }

  ngOnInit(): void {
    this.messagesService.clear();
  }

  getItems(): void {
    this.getWavelengths(this.measurement.name);
    this.getIds(this.measurement.name);
  }

  getWavelengths(name: string): void {
    this.twodimensionalgraphService.getAllWavelengths(name).subscribe(wavelengths => this.wavelengths = wavelengths);
  }

  getIds(name: string): void {
    this.twodimensionalgraphService.getAllIds(name).subscribe(ids => this.ids = ids);
  }

  getGraphData(): void {
    this.getAllIdOfWavelength();
    this.getAllWavelengthsOfId();
  }

  getAllIdOfWavelength(): void {
    this.twodimensionalgraphService.getAllIdOfWavelength(this.measurement.name, this.selectedWavelength)
      .subscribe(wavelengthsOfId => {
        this.showGraph1 = true;
        this.lineChartLabels = wavelengthsOfId.map(wavelengthOfId => wavelengthOfId.id.toString());
        this.lineChartData[0].data = wavelengthsOfId.map(wavelengthOfId => wavelengthOfId.wavelength);
      });
  }

  getAllWavelengthsOfId(): void {
    this.twodimensionalgraphService.getAllWavelengthsOfId(this.measurement.name, this.selectedTimestamp)
      .subscribe(wavelengthsOfId => {
        this.showGraph2 = true;
        this.lineChartLabels2 = Object.keys(wavelengthsOfId);
        this.lineChartData2[0].data = Object.values(wavelengthsOfId);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

export interface WavelengthsOfId {
  id: number;
  wavelength: number;
}
