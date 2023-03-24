import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { WebRTCComponent } from './web-rtc/web-rtc.component';
import { NgxWebrtcModule } from 'ngx-webrtc';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    WebRTCComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxWebrtcModule.forRoot({
      userIdentifier: 'id',
      debug: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
