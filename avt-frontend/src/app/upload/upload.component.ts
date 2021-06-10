import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { minLowerThanMaxWaveLengthValidator } from '../shared/directives/min-lower-than-max-wavelength.directive';
import { MessagesService } from '../shared/messages/messages.service';
import { UploadService } from './service/upload.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  maxMaxWaveLength = 801;
  maxMinWaveLength = 801;
  measurement = {};
  minMaxWaveLength = 0;
  minMinWaveLength = 0;
  submit = false;
  uploadForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messagesService: MessagesService,
    private uploadService: UploadService,
    private router: Router,
    ) {
    this.uploadForm = this.createForm();
  }

  /**
   * On init
   *
   * @returns void
   */
  ngOnInit(): void {
    this.messagesService.clear();
  }

  /**
   * Check if file is submitted and add file to uploadform
   *
   * @param event Event
   *
   * @returns void
   */
  uploadFile(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.uploadForm.patchValue({
        file: fileList[0]
      });
      this.uploadForm.get('file')?.updateValueAndValidity();
    }
  }

  /**
   * Check if uploadform is valid and submit form
   *
   * @returns void
   */
  onSubmit(): void {
    this.submit = true;
    if (this.uploadForm.valid) {
      const formData: any = new FormData();
      formData.append('file', this.getFile());
      formData.append('name', this.getName());
      formData.append('minWaveLength', this.getMinWaveLength());
      formData.append('maxWaveLength', this.getMaxWaveLength());
      formData.append('coefficient', this.getCoefficient());
      formData.append('description', this.getDescription());

      this.uploadService.postDadFile(formData).subscribe(response => {
        this.router.navigate([`/measurements/${response.body.id}`]);
      });
    }
  }

  /**
   * Create form
   *
   * @returns Formgroup
   */
  createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      minWaveLength: [200, [Validators.required, Validators.min(this.minMinWaveLength), Validators.max(this.maxMinWaveLength)]],
      maxWaveLength: [800, [Validators.required, Validators.min(this.minMaxWaveLength), Validators.max(this.maxMaxWaveLength)]],
      coefficient: [-0.64, Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      file: [null, [Validators.required, RxwebValidators.extension({ extensions: ['dad'] })]]
    }, { validators: minLowerThanMaxWaveLengthValidator });
  }

  /**
   * Get name from formgroup
   *
   * @returns name FormGroup
   */
  getName(): FormGroup {
    return this.uploadForm.get('name')?.value;
  }

  /**
   * Get description from formgroup
   *
   * @returns description FormGroup
   */
  getDescription(): FormGroup {
    return this.uploadForm.get('description')?.value;
  }

  /**
   * Get minWaveLength from formgroup
   *
   * @returns minWaveLength FormGroup
   */
  getMinWaveLength(): FormGroup {
    return this.uploadForm.get('minWaveLength')?.value;
  }

  /**
   * Get maxWaveLength from formgroup
   *
   * @returns maxWaveLength FormGroup
   */
  getMaxWaveLength(): FormGroup {
    return this.uploadForm.get('maxWaveLength')?.value;
  }

  /**
   * Get coefficient from formgroup
   *
   * @returns coefficient FormGroup
   */
  getCoefficient(): FormGroup {
    return this.uploadForm.get('coefficient')?.value;
  }

  /**
   * Get file from formgroup
   *
   * @returns file FormGroup
   */
  getFile(): FormGroup {
    return this.uploadForm.get('file')?.value;
  }
}
