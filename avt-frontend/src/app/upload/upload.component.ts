import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { minLowerThanMaxValidator } from '../shared/directives/min-lower-than-max.directive';
import { MessagesService } from '../shared/messages/messages.service';
import { UploadService } from './service/upload.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  submit = false;
  minMinWaveLength = 0;
  maxMinWaveLength = 801;
  minMaxWaveLength = 0;
  maxMaxWaveLength = 801;
  measurement = {}
  uploadForm: FormGroup
  constructor(
    private formBuilder: FormBuilder,
    private messagesService: MessagesService,
    private uploadService: UploadService
  ) {
    this.uploadForm = this.createForm()
  }

  ngOnInit(): void {
    this.messagesService.clear()
  }

  uploadFile(event: Event) {

    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.uploadForm.patchValue({
        file: fileList[0]
      });
      this.uploadForm.get('file')?.updateValueAndValidity()
    }
  }

  onSubmit(): void {
    this.submit = true;
    if (this.uploadForm.valid) {
      var formData: any = new FormData();
      formData.append("file", this.getFile());
      formData.append("name", this.getName());
      formData.append("minWaveLength", this.getMinWaveLength());
      formData.append("maxWaveLength", this.getMaxWaveLength());
      formData.append("coefficient", this.getCoefficient());
      formData.append("description", this.getDescription());

      this.uploadService.postDadFile(formData).subscribe(measurement => this.measurement = measurement)
    }
  }

  createForm() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      minWaveLength: [200, [Validators.required, Validators.min(this.minMinWaveLength), Validators.max(this.maxMinWaveLength)]],
      maxWaveLength: [800, [Validators.required, Validators.min(this.minMaxWaveLength), Validators.max(this.maxMaxWaveLength)]],
      coefficient: [-0.64, Validators.required], description: ['', [Validators.required, Validators.minLength(5)]],
      file: [null, [Validators.required, RxwebValidators.extension({ extensions: ["dad"] })]]
    }, { validators: minLowerThanMaxValidator })
  }

  getName() {
    return this.uploadForm.get('name')?.value
  }

  getDescription() {
    return this.uploadForm.get('description')?.value
  }

  getMinWaveLength() {
    return this.uploadForm.get('minWaveLength')?.value
  }

  getMaxWaveLength() {
    return this.uploadForm.get('maxWaveLength')?.value
  }

  getCoefficient() {
    return this.uploadForm.get('coefficient')?.value
  }

  getFile() {
    return this.uploadForm.get('file')?.value
  }
}
