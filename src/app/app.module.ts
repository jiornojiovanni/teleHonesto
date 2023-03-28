import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { VideocallPJComponent } from './videocall-pj/videocall-pj.component';
import { VisitListComponent } from './visit/visit-list/visit-list.component';
import { WebRTCComponent } from './web-rtc/web-rtc.component';
import { NgxWebrtcModule } from 'ngx-webrtc';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    VideocallPJComponent,
    VisitListComponent,
    WebRTCComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    NgxWebrtcModule.forRoot({
      userIdentifier: 'id',
      debug: true
    })
  ],
  exports: [
    MatTableModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
