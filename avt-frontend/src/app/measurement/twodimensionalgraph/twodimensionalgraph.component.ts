import { Measurement } from './../../measurement-overview/measurement';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesService } from 'src/app/shared/messages/messages.service';
import { TwodimensionalgraphService } from './service/twodimensionalgraph.service';
import { MeasurementService } from '../service/measurement.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UrlService } from './../../shared/services/url.service';

declare var Plotly: any;

@Component({
  selector: 'app-twodimensionalgraph',
  templateUrl: './twodimensionalgraph.component.html',
  styleUrls: ['./twodimensionalgraph.component.css'],
})
export class TwodimensionalgraphComponent implements OnInit, OnDestroy {
  timestamps: MultiSelectItem[] = [];
  measurement!: Measurement;
  selectedTimestamps: MultiSelectItem[] = [];
  selectedWavelength!: number;
  dropdownSettings = {};
  dropdownSettings2 = {};
  settingsTimestamps = {displaylogo: false, responsive: true, toImageButtonOptions: { filename: ''}};
  settingsWavelengths = {displaylogo: false, responsive: true, toImageButtonOptions: { filename: ''}};
  subscription: Subscription;
  wavelengths: number[] = [];
  timestampSum: MultiSelectItem[] = [];
  vectorAName!: string;
  vectorBName!: string;
  vectorCName!: string;

  arrayA: number[] = [];
  arrayB: number[] = [];
  arrayC: number[] = [];

  aa!: number;
  bb!: number;
  distance!: number;

  xData: Array<number> = [];
  yData: Array<Array<number>> = [];
  names: any = [];

  d3colors = Plotly.d3.scale.category10().range();

  allWavelengthsLayout = {
    autoexpand: 'true',
    title: 'Alle golflengtes per tijdstip',
    xaxis: {
      title: 'Golflengte (nm)',
    },
    yaxis: {
      title: 'Absorptie',
    },
    height: 350,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4,
    },
  };

  allTimestampsLayout = {
    autoexpand: 'true',
    title: 'Alle tijdstippen per golflengte',
    xaxis: {
      title: 'Tijdstip (s)',
    },
    yaxis: {
      title: 'Absorptie',
    },
    height: 350,
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4,
    },
    annotations: []
  };

  constructor(
    private twodimensionalgraphService: TwodimensionalgraphService,
    private messagesService: MessagesService,
    private measurementService: MeasurementService,
    private router: Router,
    private urlService: UrlService
    ) {
    this.dropdownSettings = {
      enableSearchFilter: true,
      enableCheckAll: false,
      enableFilterSelectAll: true,
      maxHeight: 450,
      badgeShowLimit: 3,
      text: '',
      noDataLabel: 'Er zijn geen tijdstippen beschikbaar',
      searchPlaceholderText: 'Zoeken',
      filterSelectAllText: 'Selecteer alle gevonden tijdstippen',
      classes: 'customDropdown',
      lazyLoading: true,
    };

    this.dropdownSettings2 = {
      enableSearchFilter: true,
      enableCheckAll: false,
      singleSelection: false,
      enableFilterSelectAll: false,
      maxHeight: 450,
      badgeShowLimit: 2,
      limitSelection: 2,
      text: '',
      noDataLabel: 'Er zijn geen tijdstippen beschikbaar',
      searchPlaceholderText: 'Zoeken',
      classes: 'customDropdown',
      lazyLoading: true,
    };

    this.subscription = measurementService.measurement$.subscribe(
      (measurement) => {
        this.measurement = measurement;
        this.measurement.samplingRate = measurement.samplingRate / 1000;
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
    if(this.urlService.getPreviousUrl().split('/').pop() === '3dgraph'){
      window.location.reload();
    }
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
    this.measurementService.getTimestamps(id).subscribe(
      timestamps => this.timestamps = timestamps.map(timestamp => ({id: timestamp, itemName: timestamp}))
    );
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
          Object.keys(timestampsOfIdAndWavelength).map(x => Math.round(+x * this.measurement.samplingRate * 10) / 10),
          Object.values(timestampsOfIdAndWavelength).map(x => x.wavelength));
      });
  }

  /**
   * Get all wavelengths data for the selected timestamp
   *
   * @returns void
   */
  getWavelengthsOfTimestamp(): void {
    this.twodimensionalgraphService.getWavelengthsOfTimestamp(this.measurement.id, this.selectedTimestamps.map((x) => x.id))
      .subscribe((wavelengthOfTimestamp) => {
        this.xData = Object.keys(wavelengthOfTimestamp).map((x) => +x);
        this.yData = Object.values(wavelengthOfTimestamp);
        this.names = Object.values(wavelengthOfTimestamp).pop();
        this.yData.pop();
        this.yData.pop();
        this.setVectors();
        
        if (this.timestampSum.length > 0) {
          this.getSumTimestamps();
        } else {
          this.plotAllWavelengths(this.xData, this.yData, this.names);
        }
      });
  }

  /**
   * Get the sum of wavelength data for the selected timestamps
   *
   * @returns void 
   */
  getSumTimestamps(){
    this.twodimensionalgraphService.getWavelengthsOfTimestamp(this.measurement.id, this.timestampSum.map((x) => x.id))
    .subscribe((wavelengthOfTimestamp) => {
      let yValues = Object.values(wavelengthOfTimestamp);
      let yValuesSum = yValues.map((x) => x[0] + x[1]);
      for (let i in this.yData) {
        this.yData[i].push(yValuesSum[i]);
      }
      let name = yValues[yValues.length-1][0] + ' + ' + yValues[yValues.length-1][1]
      this.names.push(name);
      this.plotAllWavelengths(this.xData, this.yData, this.names);
    });
  }

  /**
   * Plot all wavelenghts graph of selected timestamps
   *
   * @returns void
   */
  plotAllWavelengths(xData: Array<number>, yData: Array<Array<number>>, names: any): void {
    const data = [];
    for (let i = 0; i < Object.values(yData)[0].length; i++) {
      data.push({
        x: xData,
        y: Object.values(yData).map(items => items[i]),
        name: names[i].toString()
      });
    }

    this.allWavelengthsLayout.title = this.getTitleText();
    this.settingsWavelengths.toImageButtonOptions.filename = `${this.measurement.name}_golflengtes`;
    Plotly.newPlot('allWavelengths', data, this.allWavelengthsLayout, this.settingsWavelengths);    
  }

  /**
   * Get title of graph based on selected timestamps
   *
   * @returns string
   */
  getTitleText(): string {
    if (this.selectedTimestamps.length > 1) {
      this.selectedTimestamps.sort((a, b) => (+a.id > +b.id) ? 1 : -1);
      return `Alle golflengtes voor tijdstippen${this.selectedTimestamps.map(timestamp => ' ' + timestamp.id)}`;
    }
    return `Alle golflengtes voor tijdstip ${this.selectedTimestamps[0].id}`;
  }

  /**
   * Plot all timestamps graph
   *
   * @returns void
   */
  plotAllTimestamps(xData: Array<number>, yData: Array<number>): void {
    const data = [{ x: xData, y: yData }];
    this.allTimestampsLayout.title = `Alle tijdstippen voor golflengte ${this.selectedWavelength}`;
    this.settingsTimestamps.toImageButtonOptions.filename = `${this.measurement.name}_tijdstippen`;
    Plotly.newPlot('allTimestamps', data, this.allTimestampsLayout, this.settingsTimestamps);
    this.addAnnotations(data[0])
  }

  /**
   * Add annotations of selected timestamps
   * 
   * @returns void
   */
  addAnnotations(data: {x: number[], y: number[]}): void {
    let annotations: Annotation[] = [];
    const sortedTimestamps = this.selectedTimestamps;
    sortedTimestamps.sort((a, b) => (+a.id > +b.id) ? 1 : -1)
    let i = 0

    for (const timestamp of sortedTimestamps) {
      const id = Math.round(timestamp.id / this.measurement.samplingRate)
      annotations.push({
        text: timestamp.id.toString(),
        x: timestamp.id,
        y: data.y[id],
        showarrow: true,
        arrowcolor: this.d3colors[i],
        arrowhead: 7,
        ax: 0,
        ay: -50,
      });

      if (i == this.d3colors.length - 1) { i = 0 } // re-iterate over array 
      else { i += 1; }
    }
    Plotly.relayout('allTimestamps', {annotations: annotations});
  }

  /**
   * Set vectors and calculate values if there are three lines selected
   *
   * @returns void
   */
  setVectors() {
    if (!this.vectorAName) { this.vectorAName = this.names[0]; }
    if (!this.vectorBName) { this.vectorBName = this.names[1]; }
    if (!this.vectorCName) { this.vectorCName = this.names[2]; }
    if(this.names.length > 2){
      this.calculateValues();
    }
  }

  /**
   * Calculate vector D based on Vectors A, B, C, aa and bb
   * VectorD = VectorC - VectorA*aa - VectorB*bb 
   *
   * @returns void
   */
  calculateVectorD(){
    this.removeVectorD();
    let arrayAaa = this.arrayA.map(x => x * this.aa);
    let arrayBbb = this.arrayB.map(x => x * this.bb);
    for (let i in this.arrayC) {
      this.yData[i].push(this.arrayC[i] - arrayAaa[i] - arrayBbb[i]);
    }
    this.names.push('vectorD')
    this.plotAllWavelengths(this.xData, this.yData, this.names);
  }

  /**
   * Remove VectorD from yData and names if exists
   *
   * @returns void
   */
  removeVectorD(){
    let indexOfVectorD = this.names.indexOf('vectorD');
    if (indexOfVectorD !== -1) {
      for (let i in this.yData) {
        this.yData[i].splice(indexOfVectorD, 1);
      }
      this.names.splice(indexOfVectorD, 1);  
    }
  }

  /**
   * Calculate aa, bb and distance of three lines
   *
   * @returns void
   */
  calculateValues(){
    this.arrayA = this.yData.map(y => y[this.names.indexOf(this.vectorAName)]);
    this.arrayB = this.yData.map(y => y[this.names.indexOf(this.vectorBName)]);
    this.arrayC = this.yData.map(y => y[this.names.indexOf(this.vectorCName)]);
    let values = this.findCo(this.arrayA, this.arrayB, this.arrayC);
    this.aa = values[0];
    this.bb = values[1];
    this.distance = values[2];
  }

  /**
   * Find co 
   * @param A number[]
   * @param B number[]
   * @param C number[]
   *
   * @returns [aa, bb, dinstance] number[]
   */
  findCo(A: number[], B: number[], C: number[]): number[]{
    let continueLooking = true;
    let n = 0;
    let n_cut_off = 1000;
    let d_fractional_cutoff = 0.01;
    let delta_a = 0.1;
    let delta_b = 0.1;

    let a = 1;
    let b = 1;
    let d = 0;
    let d_initial = this.calcPathDistance(a, b, A, B, C);

    while (continueLooking) {
      n = n + 1;

      d = this.calcPathDistance(a, b, A, B, C);
      let d_a_up_b_up = this.calcPathDistance(a + delta_a, b + delta_b, A, B, C);
      let d_a_up_b_down = this.calcPathDistance(a + delta_a, b - delta_b, A, B, C);
      let d_a_down_b_up = this.calcPathDistance(a - delta_a, b + delta_b, A, B, C);
      let d_a_down_b_down = this.calcPathDistance(a - delta_a, b - delta_b, A, B, C);

      let d_min = Math.min(d, d_a_up_b_up, d_a_up_b_down,d_a_down_b_up,d_a_down_b_down);

      switch (d_min)
      {
        case d:
          delta_a = delta_a/2;
          delta_b = delta_b/2;
          break;
        case d_a_up_b_up:
          a = a + delta_a;
          b = b + delta_b;
          break;
        case d_a_up_b_down:
          a = a + delta_a;
          b = b - delta_b;
          break;
        case d_a_down_b_up:
          a = a - delta_a;
          b = b + delta_b;
          break;
        case d_a_down_b_down:
          a = a - delta_a;
          b = b - delta_b;
          break;
      }

      if (n > n_cut_off) continueLooking = false;

      if ((d / d_initial) < d_fractional_cutoff) continueLooking = false;
    }
    return [a,b,d]
  }
  
  /**
   * Calculate path dystance
   *
   * @param aa number 
   * @param bb number
   * @param A number[]
   * @param B number[]
   * @param C number[]
   *
   * @returns number distance
   */
  calcPathDistance(aa: number, bb: number, A: number[], B: number[], C: number[]): number {
    let tempDist = 0;
    let distance = 0;

    for(let i in A) {
        tempDist = tempDist + Math.pow((aa * A[i] + bb * B[i] - C[i]), 2);
        distance = Math.sqrt(tempDist);
    }
    return distance;
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

export interface MultiSelectItem {
  id: number;
  itemName: number;
}

export interface Annotation {
  x: number;
  y: number;
  text: string;
  showarrow?: boolean;
  arrowhead?: number,
  ax?: number,
  ay?: number,
  arrowcolor?: any,
}
