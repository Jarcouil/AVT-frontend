import { LOCALE_ID } from '@angular/core';
import { RegisterUserModule } from './register-user/register-user.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { MeasurementModule } from './measurement/measurement.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { UploadModule } from './upload/upload.module';
import { LoginModule } from './login/login.module';
import { MeasurementOverviewModule } from './measurement-overview/measurement-overview.module';
import { CoreModule } from './core/core.module';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './shared/services/interceptor-service.service';
import { ProtectedModule } from './protected/protected.module';
import { UsersOverviewComponent } from './users-overview/users-overview.component';
import { ResetModule } from './reset/reset.module';
registerLocaleData(localeNl);

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    UsersOverviewComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    MeasurementModule,
    UploadModule,
    RegisterUserModule,
    ResetModule,
    LoginModule,
    MeasurementOverviewModule,
    ProtectedModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'nl-NL' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
