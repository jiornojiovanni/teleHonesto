import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { VideocallPJComponent } from './videocall-pj/videocall-pj.component';
import { WebRTCComponent } from './web-rtc/web-rtc.component';
import { SignupComponent } from './signup/signup.component';
import { SpecificDocumentListComponent } from './specific-document-list/specific-document-list.component';
import { KurentoComponent } from "./kurento/kurento.component";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'pocPJ/:visitId', component: VideocallPJComponent, canActivate: [AuthGuard]},
  { path: 'WebRTC/:visitId', component: WebRTCComponent, canActivate: [AuthGuard]},
  { path: 'kurento/:visitId', component: KurentoComponent, canActivate: [AuthGuard]},
  { path: 'patient/:patientId', component: SpecificDocumentListComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
