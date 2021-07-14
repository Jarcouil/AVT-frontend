import { Component, ViewChild, ElementRef } from '@angular/core';
import { MeasurementService } from '../service/measurement.service';
import { Subscription } from 'rxjs';
import { Measurement } from 'src/app/measurement-overview/measurement';
import { TwodimensionalgraphService } from '../twodimensionalgraph/service/twodimensionalgraph.service';

declare var Plotly: any;

@Component({
  selector: 'app-threedimensionalgraph',
  templateUrl: './threedimensionalgraph.component.html',
  styleUrls: ['./threedimensionalgraph.component.css']
})

export class ThreedimensionalgraphComponent {

  @ViewChild('threedimensionalGraph') threedimensionalGraph!: ElementRef;
  private data!: {};

  chromatograms: Array<Array<number>> = [];
  timestamps: number[] = [];
  measurement!: Measurement;
  subscription: Subscription;
  wavelengths: number[] = [];
  xMax!: number;
  xMin!: number;
  yMax!: number;
  yMin!: number;

  layout = {
    autoexpand: 'true',
    autosize: 'true',
    width: '1000',
    height: '800',
    title: 'Absorptie per golflengtes en tijdstippen',
    automargin: true,
    scene: {
      zaxis: { title: 'Absorptie' },
      xaxis: {
        title: 'Golflengte',
        range: [this.xMin, this.xMax]
      },
      yaxis: {
        title: 'Tijd',
        range: [this.yMin, this.yMax]
      }
    }
  };

  constructor(
    private twodimensionalgraphService: TwodimensionalgraphService,
    private measurementService: MeasurementService,
  ) {
    this.subscription = measurementService.measurement$.subscribe(
      measurement => {
        this.measurement = measurement;
        this.measurement.samplingRate = measurement.samplingRate / 1000
        this.getWavelengths(measurement.id);
        this.getTimestamps(measurement.id);
      }
    );
  }

  /**
   * Get all data for the graph and plot graph
   *
   * @returns void
   */
  getData(): void {
    this.twodimensionalgraphService.getData(this.measurement.id, this.xMin, this.xMax, this.yMin, this.yMax).subscribe(chromatograms => {
      const timestamps: Array<Array<number>> = [];
      for (const chromatogram of chromatograms) {
        const wavelengths: Array<number> = [];
        for (const value of Object.values(chromatogram)) {
          wavelengths.push(value);
        }
        timestamps.push(wavelengths);
      }
      this.chromatograms = timestamps;
      this.plotGraph();
    });
  }

  /**
   * Get all wavelengths of given measurement
   *
   * @param id number
   *
   * @returns void
   */
  getWavelengths(id: number): void {
    this.measurementService.getWavelengths(id).subscribe(wavelengths => {
      this.wavelengths = wavelengths;
      this.xMin = wavelengths[0];
      this.xMax = wavelengths[wavelengths.length - 1];
    });
  }

  /**
   * Get all timestamps of given measurement
   *
   * @param id number
   *
   * @returns void
   */
  getTimestamps(id: number): void {
    this.measurementService.getTimestamps(id).subscribe(timestamps => {
      this.timestamps = timestamps;
      this.yMin = timestamps[0];
      this.yMax = timestamps[timestamps.length - 1];
    });
  }

  /**
   * Update the axis range of the graph based on the formValues
   *
   * @returns void
   */
  updateAxisRange(): void {
    this.layout.scene.xaxis.range = [this.xMin, this.xMax];
    this.layout.scene.yaxis.range = [this.yMin, this.yMax];
  }

  /**
   * Add all numbers between min and max wavelength to array
   * @returns number[]
   */
  getSelectedWavelengths(): number[] {
    const selectedWavelengths = [];
    for (let i = this.xMin; i <= this.xMax; i++) {
      selectedWavelengths.push(i);
    }
    return selectedWavelengths;
  }

  /**
   * Add all numbers between min and max timestamp to array
   * @returns number[]
   */
  getselectedTimestamps(): number[] {
    const selectedTimestamps = [];
    for (let i = this.yMin; i <= this.yMax; i = Math.round((i + this.measurement.samplingRate)*10)/10) {
      selectedTimestamps.push(i);
    }
    return selectedTimestamps;
  }

  /**
   * Plot the 3d graph
   *
   * @returns void
   */
  plotGraph(): void {
    this.updateAxisRange();
    const selectedTimestamps = this.getselectedTimestamps();
    const selectedWavelengths = this.getSelectedWavelengths();

    const hoverText = selectedTimestamps.map((yi, i) => selectedWavelengths.map((xi, j) => `
      Golflengte: ${xi}<br>
      Tijd: ${yi}<br>
      Absorptie: ${this.chromatograms[i][j]}
    `));

    this.data = {
      x: this.wavelengths,
      y: this.timestamps,
      z: this.chromatograms,
      type: 'surface',
      hoverinfo: 'text',
      text: hoverText,
    };

    Plotly.newPlot(
      this.threedimensionalGraph.nativeElement,
      [this.data],
      this.layout,
      { displaylogo: false, toImageButtonOptions: { filename: `${this.measurement.name}_3d`}}
    );
  }
}
