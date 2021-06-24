import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersOverviewComponent } from './users-overview.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [UsersOverviewComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class UsersOverviewModule { }
