import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { minLowerThanMaxValidator } from '../shared/directives/min-lower-than-max.directive';
import { MessagesService } from '../shared/messages/messages.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  
  submit = false;
  minMinWaveLength = 0;
  maxMinWaveLength = 800;
  minMaxWaveLength = 0;
  maxMaxWaveLength = 800;

  uploadForm: FormGroup
  constructor(
    private formBuilder: FormBuilder,
    private messagesService: MessagesService
  ) {
    this.uploadForm = this.createForm()
   }

  ngOnInit(): void {
    this.messagesService.clear()
  }

  onSubmit(): void {
    this.submit = true;
    if(this.uploadForm.valid){
      this.uploadForm.reset();
      console.log('succes')
    } else{
      console.log('invalid')
    }
  }

  createForm(){
    return this.formBuilder.group({
      name: ['', Validators.required],
      minWaveLength: [200, [Validators.required, Validators.min(this.minMinWaveLength), Validators.max(this.maxMinWaveLength)]],
      maxWaveLength: [800, [Validators.required, Validators.min(this.minMaxWaveLength), Validators.max(this.maxMaxWaveLength)]],
      coefficient: [-0.64, Validators.required], description: ['', [Validators.required, Validators.minLength(5)]],
      file: ['', [Validators.required, RxwebValidators.extension({extensions:["dad"]})]] 
    }, {validators: minLowerThanMaxValidator})
  }
}
