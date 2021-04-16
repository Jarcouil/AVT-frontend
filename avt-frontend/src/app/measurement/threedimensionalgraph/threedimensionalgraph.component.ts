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
        for (const value of Object.values(chromatogram)) {
          wavelengths.push(value);
        }
        timestamps.push(wavelengths);
      }
      this.chromatograms = timestamps;
      this.plotGraph();
    });
  }

  plotGraph(): void {
    this.data = {
      z: this.chromatograms,
      type: 'surface'
    };

    Plotly.newPlot(
      this.threedimensionalGraph.nativeElement,
      [this.data],
      {
        autoexpand: 'true',
        autosize: 'true',
        width: '1000',
        height: '800',
        title: 'Absorptie per golflengtes en tijdstippen',
        automargin: true
      }
    );
  }
}
