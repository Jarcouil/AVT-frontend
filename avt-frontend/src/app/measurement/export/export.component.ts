import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Measurement } from 'src/app/measurement-overview/measurement';
import { MeasurementService } from '../service/measurement.service';
import { ExportService } from './service/export.service';
import { saveAs } from 'file-saver';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { minLowerThanMaxWaveLengthValidator } from 'src/app/shared/directives/min-lower-than-max-wavelength.directive';
import { minLowerThanMaxTimestampValidator } from '../../shared/directives/min-lower-than-max-timestamp.directive';
import { MultiSelectItem } from '../twodimensionalgraph/twodimensionalgraph.component';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  exportForm!: FormGroup;
  fileNames!: string[];
  measurement!: Measurement;
  submit = false;
  subscription: Subscription;
  exportAsRange!: boolean;
  dropdownSettings = {};

  minWavelength!: number;
  maxWavelength!: number;
  minTimestamp!: number;
  maxTimestamp!: number;

  multiSelectWavelengths: MultiSelectItem[] = [];

  constructor(
    private exportService: ExportService,
    private measurementService: MeasurementService,
    private formBuilder: FormBuilder,
    private urlService: UrlService
    ) {
    this.dropdownSettings = {
      enableSearchFilter: true,
      enableCheckAll: true,
      enableFilterSelectAll: true,
      maxHeight: 450,
      badgeShowLimit: 5,
      text: '',
      noDataLabel: 'Er is geen data beschikbaar',
      searchPlaceholderText: 'Zoeken',
      filterSelectAllText: 'Selecteer alle gevonden data',
      classes: 'customDropdown',
      selectAllText: 'Selecteer alles',
      unSelectAllText: 'Deselecteer alles',
      lazyLoading: true
    };

    this.subscription = measurementService.measurement$.subscribe(
      measurement => {
        this.measurement = measurement;
        if (this.measurement) {
          this.getWavelengths(measurement.id);
          this.getTimestamps(measurement.id);
          this.exportService.getFileInfo(this.measurement.id).subscribe(files => this.fileNames = files.fileNames);
        }
      });
  }

  /**
   * On init
   *
   * @returns void
   */
  ngOnInit(): void {
    const previousUrl = this.urlService.getPreviousUrl().split('/').pop();
    if(previousUrl === '3dgraph' || previousUrl === '2dgraph'){
      window.location.reload();
    }
    this.exportForm = this.createForm();
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
      }, { validators: [minLowerThanMaxTimestampValidator] });
  }

  /**
   * Download original DAD file
   *
   * @returns void
   */
  downloadFile(file: string): void {
    this.exportService.downloadFile(this.measurement.id, file).subscribe(blob => saveAs(blob, file));
  }

  /**
   * Submit request with a range of wavelengths
   *
   * @returns void
   */
  submitAsRange(): void {
    const formData: any = new FormData();
    formData.append('minWaveLength', this.getMinWavelength());
    formData.append('maxWaveLength', this.getMaxWavelength());
    formData.append('minTimestamp', this.getMinTimestamp());
    formData.append('maxTimestamp', this.getMaxTimestamp());
    const filename = `${this.measurement.name}_${this.getMinWavelength()}-${this.getMaxWavelength()}_${this.getMinTimestamp()}-${this.getMaxTimestamp()}`;

    this.exportService.getCSVRange(this.measurement.id, formData).subscribe(blob => saveAs(blob, `${filename}.csv`));
  }

  /**
   * Submit request with selected wavelengths
   */
  submitAsSelect(): void {
      const filename = `${this.measurement.name}`;
      this.exportService.getCSV(
        this.measurement.id, 
        this.getSelectedWavelengths(),
        this.getMinTimestamp(),
        this.getMaxTimestamp(),
      ).subscribe(blob => saveAs(blob, `${filename}.csv`));
  }

  /**
   * Switch wavelength FormControl based on boolean.
   */
  switchWavelengthControl(): void {
    if (this.exportAsRange) {
      this.exportForm.removeControl('wavelengths')
      this.exportForm.addControl('minWavelength', new FormControl(+this.minWavelength))
      this.exportForm.addControl('maxWavelength', new FormControl(+this.maxWavelength))
      this.setWavelengthValidators()
    } else {
      this.exportForm.removeControl('minWavelength')
      this.exportForm.removeControl('maxWavelength')
      this.exportForm.addControl('wavelengths', new FormControl([], Validators.required))
    }
  }

  /**
   * Call submit function based on exportAsRange if exportForm is valid
   *
   * @returns void
   */
  onSubmit(): void {
    this.submit = true;
    if (this.exportForm.valid){
      if (this.exportAsRange){
        this.submitAsRange();
      } else {
        this.submitAsSelect();
      }
    }
  }

  /**
   * Get all wavelengths of given measurement
   *
   * @param name string
   *
   * @returns void
   */
  getWavelengths(id: number): void {
    this.measurementService.getWavelengths(id).subscribe(wavelengths => {
      this.multiSelectWavelengths = wavelengths.map(wavelength => ({id: wavelength, itemName: wavelength}))
      this.minWavelength = wavelengths[0];
      this.maxWavelength = wavelengths[wavelengths.length - 1];
      this.exportAsRange = true;
      this.switchWavelengthControl();
    });
  }

  /**
   * Get all timestamps of given measurement
   *
   * @param id string
   *
   * @returns void
   */
  getTimestamps(id: number): void {
    this.measurementService.getTimestamps(id).subscribe(timestamps => {
      this.minTimestamp = timestamps[0];
      this.maxTimestamp = timestamps[timestamps.length - 1];

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
    this.exportForm.get('minWavelength')?.setValidators(
      [
        Validators.required,
        Validators.min(this.minWavelength),
        Validators.max(this.maxWavelength)
      ]);

    this.exportForm.get('maxWavelength')?.setValidators(
      [
        Validators.required,
        Validators.min(this.minWavelength),
        Validators.max(this.maxWavelength)
      ]);
    this.exportForm.setValidators([minLowerThanMaxWaveLengthValidator])
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
    return this.exportForm.get('minWavelength')?.value;
  }

  /**
   * Get maxWavelength from exportForm
   *
   * @returns number maxWavelength
   */
  getMaxWavelength(): number {
    return this.exportForm.get('maxWavelength')?.value;
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

  /**
   * Get wavelengths from exportForm
   *
   * @returns number[] wavelengths
   */
  getSelectedWavelengths(): number[] {
    return (this.exportForm.get('wavelengths')?.value).map((x: { id: any; }) => x.id);
  }
}
