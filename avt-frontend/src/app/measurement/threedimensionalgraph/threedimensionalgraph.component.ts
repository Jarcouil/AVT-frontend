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
  xMin = 0;
  xMax = 200;
  yMin = 500;
  yMax = 1000;

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

  updateAxisRange(): void {
    this.layout.scene.xaxis.range = [this.xMin, this.xMax];
    this.layout.scene.yaxis.range = [this.yMin, this.yMax];
  }

  plotGraph(): void {
    this.updateAxisRange();
    this.data = {
      z: this.chromatograms,
      type: 'surface',
    };

    Plotly.newPlot(
      this.threedimensionalGraph.nativeElement,
      [this.data],
      this.layout
    );
  }
}
