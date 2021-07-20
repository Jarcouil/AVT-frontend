import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import {PopoverModule} from "ngx-smart-popover";

@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    PopoverModule 
  ]
})
export class UploadModule { }
