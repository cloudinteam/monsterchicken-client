import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutsModule } from './layouts/layouts.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexModule } from '@angular/flex-layout';
import { GoogleMapsModule } from '@angular/google-maps';
import {  GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { DialogService } from 'primeng/dynamicdialog';


@NgModule({
  declarations: [
    AppComponent,
    // GooglePlaceModule, GooglePlaceDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutsModule,
    HttpClientModule,
    NgbModule,
    FlexModule,
    GoogleMapsModule,
    GooglePlaceModule,
  ],
  exports: [
    GooglePlaceModule
  ],
  providers: [
    DialogService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
