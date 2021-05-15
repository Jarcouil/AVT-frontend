import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

export class ThreedimensionalgraphComponent implements OnInit {

  @ViewChild('threedimensionalGraph') threedimensionalGraph!: ElementRef;
  private data!: {};

  tableName!: string;
  measurement!: Measurement;
  subscription: Subscription;
  chromatograms: Array<Array<number>> = [];
  wavelengths: number[] = [];
  ids: number[] = [];
  xMin!: number;
  xMax!: number;
  yMin!: number;
  yMax!: number;

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
        this.tableName = measurement.id.toString() + '_' + measurement.name;
        this.getWavelengths(this.tableName);
        this.getIds(this.tableName);
        this.getAllData();
      }
    );
  }

  /**
   * On init
   *
   * @returns void
   */
  ngOnInit(): void {
  }

  /**
   * Get all data for the graph and plot graph
   *
   * @returns void
   */
  getAllData(): void {
    this.twodimensionalgraphService.getAllData(this.tableName).subscribe(chromatograms => {
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
   * @param name string
   *
   * @returns void
   */
  getWavelengths(name: string): void {
    this.measurementService.getAllWavelengths(name).subscribe(wavelengths => {
      this.wavelengths = wavelengths;
      this.xMin = wavelengths[0];
      this.xMax = wavelengths[wavelengths.length - 1];
    });
  }

  /**
   * Get all ids of given measurement
   *
   * @param name string
   *
   * @returns void
   */
  getIds(name: string): void {
    // TODO change ids to timestamps
    this.measurementService.getAllIds(name).subscribe(ids => {
      this.ids = ids;
      this.yMin = ids[0];
      this.yMax = ids[ids.length - 1];
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
   * Plot the 3d graph
   *
   * @returns void
   */
  plotGraph(): void {
    this.updateAxisRange();

    const hoverText = this.ids.map((yi, i) => this.wavelengths.map((xi, j) => `
      Golflengte: ${xi}<br>
      Tijd: ${yi}<br>
      Absorptie: ${this.chromatograms[i][j]}
      `));

    this.data = {
      x: this.wavelengths,
      y: this.ids,
      z: this.chromatograms,
      type: 'surface',
      hoverinfo: 'text',
      text: hoverText,
    };

    Plotly.newPlot(
      this.threedimensionalGraph.nativeElement,
      [this.data],
      this.layout,
      {displaylogo: false}
    );
  }
}
