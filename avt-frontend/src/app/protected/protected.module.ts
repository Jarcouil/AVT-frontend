import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';
import { ProtectedComponent } from './protected.component';


@NgModule({
  declarations: [
    ProtectedComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ProtectedModule { }
