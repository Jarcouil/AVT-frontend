import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Measurement } from 'src/app/measurement-overview/measurement';
import { MeasurementService } from '../service/measurement.service';
import { ExportService } from './service/export.service';
import { saveAs } from 'file-saver';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { minLowerThanMaxWaveLengthValidator } from 'src/app/shared/directives/min-lower-than-max-wavelength.directive';
import { minLowerThanMaxTimestampValidator } from '../../shared/directives/min-lower-than-max-timestamp.directive';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  fileName!: string;
  measurement!: Measurement;
  subscription: Subscription;
  tableName!: string;

  minWavelength!: number;
  maxWavelength!: number;
  minTimestamp!: number;
  maxTimestamp!: number;

  exportForm!: FormGroup;

  constructor(
    private exportService: ExportService,
    private measurementService: MeasurementService,
    private formBuilder: FormBuilder,
  ) {
    this.subscription = measurementService.measurement$.subscribe(
      measurement => {
        this.measurement = measurement;
        if (this.measurement) {
          this.tableName = measurement.id.toString() + '_' + measurement.name;
          this.getWavelengths(this.tableName);
          this.getIds(this.tableName);
          this.exportService.getDadFileName(this.measurement.id).subscribe(file => this.fileName = file.fileName);
        }
      });
  }

  ngOnInit(): void {
    this.exportForm = this.createForm();
  }

  /**
   * Create form
   *
   * @returns Formgroup
   */
  createForm(): FormGroup {
    return this.formBuilder.group({
      minWaveLength: [],
      maxWaveLength: [],
      minTimestamp: [],
      maxTimestamp: [],
    }, { validators: [minLowerThanMaxWaveLengthValidator, minLowerThanMaxTimestampValidator] });
  }

  /**
   * Download original DAD file
   *
   * @returns void
   */
  downloadFile(): void {
    this.exportService.downloadDadFile(this.measurement.id).subscribe(blob => saveAs(blob, this.fileName));
  }

  /**
   * Download CSV file
   *
   * @returns void
   */
  exportCSV(): void {
    if (this.exportForm.valid) {
      const formData: any = new FormData();
      formData.append('minWaveLength', this.getMinWavelength());
      formData.append('maxWaveLength', this.getMaxWavelength());
      formData.append('minTimestamp', this.getMinTimestamp());
      formData.append('maxTimestamp', this.getMaxTimestamp());
      const filename = this.measurement.name
        + '_'
        + this.getMinWavelength().toString()
        + '-'
        + this.getMaxWavelength().toString()
        + '_' + this.getMinTimestamp().toString()
        + '-' + this.getMaxTimestamp().toString();
        
      this.exportService.getCSV(this.measurement.id, formData).subscribe(blob => saveAs(blob, `${filename}.csv`));
    }
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
      this.minWavelength = wavelengths[0];
      this.maxWavelength = wavelengths[wavelengths.length - 1];
      this.exportForm.patchValue({
        minWaveLength: this.minWavelength,
        maxWaveLength: this.maxWavelength
      });
      this.setWavelengthValidators();
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
      this.minTimestamp = ids[0];
      this.maxTimestamp = ids[ids.length - 1];
      this.exportForm.patchValue({
        minTimestamp: this.minTimestamp,
        maxTimestamp: this.maxTimestamp
      });
      this.setTimestampValidators();
    });
  }

  /**
   * Set wavelength validators
   *
   * @returns void
   */
  setWavelengthValidators(): void {
    this.exportForm.get('minWaveLength')?.setValidators(
      [
        Validators.required,
        Validators.min(this.minWavelength),
        Validators.max(this.maxWavelength)
      ]);

    this.exportForm.get('maxWaveLength')?.setValidators(
      [
        Validators.required,
        Validators.min(this.minWavelength),
        Validators.max(this.maxWavelength)
      ]);
  }

  /**
   * Set tiemstamp validators
   *
   * @returns void
   */
  setTimestampValidators(): void {
    this.exportForm.get('minTimestamp')?.setValidators(
      [
        Validators.required,
        Validators.min(this.minTimestamp),
        Validators.max(this.maxTimestamp)
      ]);

    this.exportForm.get('maxTimestamp')?.setValidators(
      [
        Validators.required,
        Validators.min(this.minTimestamp),
        Validators.max(this.maxTimestamp)
      ]);
  }

  /**
   * Get minWavelength from exportForm
   *
   * @returns number minWavelength
   */
  getMinWavelength(): number {
    return this.exportForm.get('minWaveLength')?.value;
  }

  /**
   * Get maxWavelength from exportForm
   *
   * @returns number maxWavelength
   */
  getMaxWavelength(): number {
    return this.exportForm.get('maxWaveLength')?.value;
  }

  /**
   * Get minTimestamp from exportForm
   *
   * @returns number minTimestamp
   */
  getMinTimestamp(): number {
    return this.exportForm.get('minTimestamp')?.value;
  }

  /**
   * Get maxTimestamp from exportForm
   *
   * @returns number maxTimestamp
   */
  getMaxTimestamp(): number {
    return this.exportForm.get('maxTimestamp')?.value;
  }
}
