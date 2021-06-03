import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeasurementOverviewComponent } from './measurement-overview/measurement-overview.component';
import { ExportComponent } from './measurement/export/export.component';
import { MeasurementComponent } from './measurement/measurement.component';
import { ThreedimensionalgraphComponent } from './measurement/threedimensionalgraph/threedimensionalgraph.component';
import { TwodimensionalgraphComponent } from './measurement/twodimensionalgraph/twodimensionalgraph.component';
import { UploadComponent } from './upload/upload.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { ProtectedComponent } from './protected/protected.component';
import { AccountComponent } from './account/account.component';
import { UsersOverviewComponent } from './users-overview/users-overview.component';
import { Role } from './models/role';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ResetComponent } from './reset/reset.component';
import { RequestResetComponent } from './request-reset/request-reset.component';

const routes: Routes = [
  {
    path: '', component: ProtectedComponent, canActivate: [AuthGuardService],
    children: [
      { path: 'measurements/:id', component: MeasurementComponent,
      children: [
        { path: '', redirectTo: 'export', pathMatch: 'full' },
        { path: '3dgraph', component: ThreedimensionalgraphComponent },
        { path: '2dgraph', component: TwodimensionalgraphComponent },
        { path: 'export', component: ExportComponent },
        { path: '**', redirectTo: 'export' }
      ],
      canActivate: [AuthGuardService]
    },
    { path: 'measurements', component: MeasurementOverviewComponent, canActivate: [AuthGuardService] },
    { path: 'upload', component: UploadComponent, canActivate: [AuthGuardService] },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuardService] },
    { path: 'users', component: UsersOverviewComponent, canActivate: [AuthGuardService], data: { roles: [Role.Admin] } },
    ]
  },
  { path: 'register', component: RegisterUserComponent },
  { path: 'reset/:token', component: ResetComponent },
  { path: 'request-reset', component: RequestResetComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
