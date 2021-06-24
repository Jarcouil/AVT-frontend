import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersOverviewComponent } from './users-overview.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsersOverviewComponent],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class UsersOverviewModule { }
