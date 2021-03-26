import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  uploadForm = this.formBuilder.group({
    name: '',
    minWaveLength: '',
    maxWaveLength: '',
    coefficient: '',
    description: '',
    file: '' 
  })

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.uploadForm.reset();
  }

}
