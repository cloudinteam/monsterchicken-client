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
    // GooglePlaceDirective,
    GooglePlaceModule

    // AgmCoreModule.forRoot({
    //   // please get your own API key here:
    //   // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
    //   apiKey: 'AIzaSyA5hHeRt5t1M4irYLCh95a0mcaqu8_MFjc'
    // }),
    // NgxGpAutocompleteModule.forRoot({
    //   loaderOptions: { apiKey: 'AIzaSyA26x9clnhzvqzHUOxbeuDyERIFvLrrFlI' }
    // }),
  ],
  exports: [
    GooglePlaceModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
