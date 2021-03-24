import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MeasurementModule } from './measurement/measurement.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { UploadModule } from './upload/upload.module';
import { MeasurementOverviewModule } from './measurement-overview/measurement-overview.module';
import { NavbarComponent } from './shared/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MeasurementModule,
    UploadModule,
    MeasurementOverviewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
