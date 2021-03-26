import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  RxReactiveFormsModule } from "@rxweb/reactive-form-validators"

@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule
  ]
})
export class UploadModule { }
