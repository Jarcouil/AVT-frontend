import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';



@NgModule({
  declarations: [MessagesComponent],
  imports: [
    CommonModule
  ],
  exports: [
    HttpClientModule,
    RouterModule,
    MessagesComponent
  ]
})
export class SharedModule { }
