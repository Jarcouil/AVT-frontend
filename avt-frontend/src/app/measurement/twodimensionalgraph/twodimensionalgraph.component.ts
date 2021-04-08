import { Measurement } from './../../measurement-overview/measurement';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesService } from 'src/app/shared/messages/messages.service';
import { TwodimensionalgraphService } from './service/twodimensionalgraph.service';
import { MeasurementService } from '../service/measurement.service';
import { Subscription } from 'rxjs';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-twodimensionalgraph',
  templateUrl: './twodimensionalgraph.component.html',
  styleUrls: ['./twodimensionalgraph.component.css']
})
export class TwodimensionalgraphComponent implements OnInit, OnDestroy {
  measurement!: Measurement;
  columns = [];
  ids = [];
  subscription: Subscription;
  showGraph1 = false;
  showGraph2 = false;

  selectedWavelength!: number;
  selectedTimestamp!: number;

  // columnsOfId: WavelengthsOfId[] = [];

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Tijdstippen per golflengte' },
  ];

  lineChartLabels: Label[] = [];

  lineChartData2: ChartDataSets[] = [
    { data: [], label: 'Golflengtes per tijdstip' },
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
    this.getColumns(this.measurement.name);
    this.getIds(this.measurement.name);
  }


  getColumns(name: string): void {
    this.twodimensionalgraphService.getAllColumns(name).subscribe(columns => this.columns = columns);
  }

  getIds(name: string): void {
    this.twodimensionalgraphService.getAllIds(name).subscribe(ids => this.ids = ids);
  }

  getGraphData(): void {
    this.getAllIdOfWavelength();
    this.getAllWavelengthsOfId();
  }

  getAllIdOfWavelength(): void {
    this.twodimensionalgraphService.getAllIdOfWavelength(this.measurement.name, this.selectedWavelength )
      .subscribe(columnsOfId => {
        this.showGraph1 = true;
        this.lineChartLabels =        columnsOfId.map(columnsOfId => columnsOfId.id.toString());
        this.lineChartData[0].data =  columnsOfId.map(columnsOfId => columnsOfId.column);
      });
  }

  getAllWavelengthsOfId(): void {
    this.twodimensionalgraphService.getAllWavelengthsOfId(this.measurement.name, this.selectedTimestamp)
      .subscribe(wavelengthsOfId => {
        this.showGraph2 = true;
        this.lineChartLabels2 = Object.keys(wavelengthsOfId);
        this.lineChartData2[0].data = Object.values(wavelengthsOfId);
        // console.log(wavelengthsOfId)
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

export interface WavelengthsOfId {
  id: number;
  column: number;
}
