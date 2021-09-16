import { Component } from '@angular/core';
import { MeasurementService } from '../service/measurement.service';
import { Subscription } from 'rxjs';
import { Measurement } from 'src/app/measurement-overview/measurement';
import { TwodimensionalgraphService } from '../twodimensionalgraph/service/twodimensionalgraph.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { minLowerThanMaxWaveLengthValidator } from 'src/app/shared/directives/min-lower-than-max-wavelength.directive';
import { minLowerThanMaxTimestampValidator } from '../../shared/directives/min-lower-than-max-timestamp.directive';
declare var Plotly: any;

@Component({
  selector: 'app-threedimensionalgraph',
  templateUrl: './threedimensionalgraph.component.html',
  styleUrls: ['./threedimensionalgraph.component.css']
})
export class ThreedimensionalgraphComponent {
  private data!: {};
  graphForm!: FormGroup;
  submit = false;

  chromatograms: Array<Array<number>> = [];
  timestamps: number[] = [];
  measurement!: Measurement;
  subscription: Subscription;
  wavelengths: number[] = [];
  xMax!: number;
  xMin!: number;
  yMax!: number;
  yMin!: number;
  selectedxMax!: number;
  selectedxMin!: number;
  selectedyMax!: number;
  selectedyMin!: number;

  layout = {
    autoexpand: 'true',
    autosize: false,
    width: 1200,
    height: 700,
    title: 'Absorptie per golflengtes en tijdstippen',
    automargin: false,
    scene: {
      zaxis: { title: 'Absorptie' },
      xaxis: {
        title: 'Golflengte (nm)',
        range: [this.selectedxMin, this.selectedxMax]
      },
      yaxis: {
        title: 'Tijd (s)',
        range: [this.selectedyMin, this.selectedyMax]
      },
    margin: {
        l: 50,
        r: 50,
        b: 0,
        t: 0,
        pad: 0
      }
    }
  };

  constructor(
    private twodimensionalgraphService: TwodimensionalgraphService,
    private measurementService: MeasurementService,
    private formBuilder: FormBuilder,
    private urlService: UrlService
    ) {
    this.subscription = measurementService.measurement$.subscribe(
      measurement => {
        this.measurement = measurement;
        this.measurement.samplingRate = measurement.samplingRate / 1000 // ms --> seconds
        this.getWavelengths(measurement.id);
        this.getTimestamps(measurement.id);
      }
    );
  }

  /**
   * On init
   *
   * @returns void
   */
     ngOnInit(): void {
      if(this.urlService.getPreviousUrl().split('/').pop() === '2dgraph'){
        window.location.reload();
      }
      this.graphForm = this.createForm();
  }

  /**
   * Create form
   *
   * @returns Formgroup
   */
    createForm(): FormGroup {
      return this.formBuilder.group({
        minTimestamp: [],
        maxTimestamp: [],
        minWavelength: [],
        maxWavelength: [],
      }, { validators: [minLowerThanMaxTimestampValidator, minLowerThanMaxWaveLengthValidator] });
  }

  onSubmit(): void {
    this.submit = true;
    if (this.graphForm.valid){
      this.getData()
    }
  }

  /**
   * Get all data for the graph and plot graph
   *
   * @returns void
   */
  getData(): void {
    this.twodimensionalgraphService.getData(this.measurement.id, this.getMinWavelength(), this.getMaxWavelength(), this.getMinTimestamp(), this.getMaxTimestamp()).subscribe(chromatograms => {
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
      this.xMin = this.selectedxMin = wavelengths[0];
      this.xMax = this.selectedxMax = wavelengths[wavelengths.length - 1];
      this.setWavelengthValidators();
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
      this.yMin = this.selectedyMin = timestamps[0];
      this.yMax = this.selectedyMax = timestamps[timestamps.length - 1];
      this.setTimestampValidators();
    });
  }

  /**
   * Update the axis range of the graph based on the formValues
   *
   * @returns void
   */
  updateAxisRange(): void {
    this.layout.scene.xaxis.range = [this.selectedxMin, this.selectedxMax];
    this.layout.scene.yaxis.range = [this.selectedyMin, this.selectedyMax];
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
      Golflengte: ${xi}nm<br>
      Tijd: ${yi}s<br>
      Absorptie: ${this.chromatograms[i][j]}
    `));

    this.data = [{
      colorscale: [
        ['0.00', '#000000'],
        ['0.14', '#3F3F3F'],
        ['0.28', '#5672C7'],
        ['0.42', '#60A0FF'],
        ['0.57', '#54FFFF'],
        ['0.71', '#00AD00'],
        ['0.85', '#FFBD7A'],
        ['1.0',    '#E81123'],
      ],
      x: this.wavelengths,
      y: this.timestamps,
      z: this.chromatograms,
      type: 'surface',
      hoverinfo: 'text',
      text: hoverText,
    }];

    Plotly.newPlot(
      'threedimensionalGraph',
      this.data,
      this.layout,
      { displaylogo: false, toImageButtonOptions: { filename: `${this.measurement.name}_3d`}}
    );
  }

  /**
   * Set wavelength validators
   *
   * @returns void
   */
   setWavelengthValidators(): void {
    this.graphForm.get('minWavelength')?.setValue(this.xMin)
    this.graphForm.get('maxWavelength')?.setValue(this.xMax)
      this.graphForm.get('minWavelength')?.setValidators(
      [
        Validators.required,
        Validators.min(this.xMin),
        Validators.max(this.xMax),
      ]);

    this.graphForm.get('maxWavelength')?.setValidators(
      [
        Validators.required,
        Validators.min(this.xMin),
        Validators.max(this.xMax),
      ]);
    this.graphForm.setValidators([minLowerThanMaxWaveLengthValidator])
  }

  /**
   * Set tiemstamp validators
   *
   * @returns void
   */
  setTimestampValidators(): void {
    this.graphForm.get('minTimestamp')?.setValue(this.yMin)
    this.graphForm.get('maxTimestamp')?.setValue(this.yMax)
    this.graphForm.get('minTimestamp')?.setValidators(
      [
        Validators.required,
        Validators.min(this.yMin),
        Validators.max(this.yMax),
      ]);

    this.graphForm.get('maxTimestamp')?.setValidators(
      [
        Validators.required,
        Validators.min(this.yMin),
        Validators.max(this.yMax),
      ]);
  }

  /**
   * Get minWavelength from graphForm
   *
   * @returns number minWavelength
   */
   getMinWavelength(): number {
    return this.graphForm.get('minWavelength')?.value;
  }

  /**
   * Get maxWavelength from graphForm
   *
   * @returns number maxWavelength
   */
  getMaxWavelength(): number {
    return this.graphForm.get('maxWavelength')?.value;
  }

  /**
   * Get minTimestamp from graphForm
   *
   * @returns number minTimestamp
   */
  getMinTimestamp(): number {
    return this.graphForm.get('minTimestamp')?.value;
  }

  /**
   * Get maxTimestamp from graphForm
   *
   * @returns number maxTimestamp
   */
  getMaxTimestamp(): number {
    return this.graphForm.get('maxTimestamp')?.value;
  }
}
