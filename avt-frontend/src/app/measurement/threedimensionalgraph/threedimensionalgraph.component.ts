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
        this.getWavelengths(this.measurement.name);
        this.getIds(this.measurement.name);
        this.getAllData();
      }
    );
  }

  ngOnInit(): void {
  }

  getAllData(): void {
    this.twodimensionalgraphService.getAllData(this.measurement.name).subscribe(chromatograms => {
      const timestamps: Array<Array<number>> = [];
      for (const chromatogram of chromatograms) {
        const wavelengths: Array<number> = [];
        for (const [key, value] of Object.entries(chromatogram)) {
          wavelengths.push(value);
        }
        timestamps.push(wavelengths);
      }
      this.chromatograms = timestamps;
      this.plotGraph();
    });
  }

  getWavelengths(name: string): void {
    this.twodimensionalgraphService.getAllWavelengths(name).subscribe(wavelengths => {
      this.wavelengths = wavelengths;
      this.xMin = wavelengths[0];
      this.xMax = wavelengths[wavelengths.length - 1];
    });
  }

  getIds(name: string): void {
    this.twodimensionalgraphService.getAllIds(name).subscribe(ids => {
      this.ids = ids;
      this.yMin = ids[0];
      this.yMax = ids[ids.length - 1];
    });
  }

  updateAxisRange(): void {
    this.layout.scene.xaxis.range = [this.xMin, this.xMax];
    this.layout.scene.yaxis.range = [this.yMin, this.yMax];
  }

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
      this.layout
    );
  }
}
