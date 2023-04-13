import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Marker } from 'src/app/models/agm.model';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {

  map!: google.maps.Map;
  marker!: google.maps.Marker;
  geocoder!: google.maps.Geocoder;
  responseDiv!: HTMLDivElement;
  response!: HTMLPreElement;


  // @ViewChild('map') mapArea!: HTMLElement;
  @ViewChild('map') mapArea!: ElementRef;
  @ViewChild('locationAllow') locationAllow!: TemplateRef<any>;

  loader = new Loader({
    apiKey: 'AIzaSyA5hHeRt5t1M4irYLCh95a0mcaqu8_MFjc',
  });


  // google maps zoom level
  zoom: number = 7;

  // initial center position for the map
  lat: number = 0;
  lng: number = 0;
  mapMarker: Marker =  {
    lat: 0,
    lng: 0,
    draggable: true,
    // label: ''
  }

  constructor(
    private elementRef: ElementRef,
    private ngbModal: NgbModal
   ) {}

  ngOnInit(): void {
    // console.log(this.mapArea.nativeElement);
  }

  ngAfterViewInit() {
    let loader = new Loader({
      apiKey: 'AIzaSyA5hHeRt5t1M4irYLCh95a0mcaqu8_MFjc',
    });

    loader.load().then(() => {
      console.log('loaded');
      // console.log(this.mapArea.nativeElement);
      // new google.maps.Map(this.mapArea)
      new google.maps.Map(this.elementRef.nativeElement.querySelector('#map'), {
        center: { lat: 11.0184834, lng: 76.9648675 },
        zoom: 5
      })
    })
    this.handlePermission();
  }

  handlePermission() {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      // console.log(result);
      if (result.state === "granted") {
        // console.log(result.state);
        // this.ngOnInit();
        this.getCoords();
      } else if (result.state === "prompt") {
        this.getCoords();
      } else if (result.state === "denied") {
        console.log(result.state);
        this.positionDenied();
      }
      result.addEventListener("change", () => {
        console.log(result.state);
      });
    });
  }


  geocode(request: google.maps.GeocoderRequest): void {
    // clear();

    this.geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
        this.map.setCenter(results[0].geometry.location);
        this.marker.setPosition(results[0].geometry.location);
        this.marker.setMap(this.map);
        this.responseDiv.style.display = 'block';
        this.response.innerText = JSON.stringify(result, null, 2);
        return results;
      })
      .catch((e) => {
        alert('Geocode was not successful for the following reason: ' + e);
      });
  }

  closeBlocker() {
    this.ngbModal.dismissAll();
    this.handlePermission();
  }

  positionDenied() {
    this.ngbModal.open(this.locationAllow, { centered: true, size: "md" });
  }

  getCoords() {
    console.log("getCoords Called");
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      // console.log(result);
      if (result.state === "granted") {
        navigator.geolocation.getCurrentPosition(
          (position: any) => {
            if (position) {
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;
              this.mapMarker = {
                lat: this.lat,
                lng: this.lng,
                draggable: true,
              };
              // console.log(this.mapMarker);
              // this.form.latitude.setValue(this.lat);
              // this.form.longitude.setValue(this.lng);
              // this.cdRef.markForCheck();
            }
          },
          () => {
            this.ngbModal.open(this.locationAllow, { centered: true, size: "md" });
          }
        );
      } else if (result.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          (position: any) => {
            if (position) {
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;
              this.mapMarker = {
                lat: this.lat,
                lng: this.lng,
                draggable: true,
              };
              // console.log(this.mapMarker);
              // this.form.latitude.setValue(this.lat);
              // this.form.longitude.setValue(this.lng);
              // this.cdRef.markForCheck();
            }
          },
          () => {
            this.ngbModal.open(this.locationAllow, { centered: true, size: "md" });
          }
        );
      } else if (result.state === "denied") {
        this.positionDenied();
      }
      result.addEventListener("change", () => {
        console.log(result.state);
        // this.ngOnInit();
      });
    });
  }

  clickedMarker($event: google.maps.MapMouseEvent) {
    console.log(`clicked the marker: ${$event}`)
  }

  mapClicked($event: MouseEvent) {
    console.log($event);
    // this.mapMarker = {
    //   lat: $event.coords.lat,
    //   lng: $event.coords.lng,
    //   draggable: true
    // }
    // this.form.latitude.setValue($event.coords.lat);
    // this.form.longitude.setValue($event.coords.lng);
    // this.cdRef.markForCheck();
  }

  markerDragEnd(m: Marker, $event: google.maps.MapMouseEvent) {
    console.log('dragEnd', $event);
    // this.form.latitude.setValue($event.coords.lat);
    // this.form.longitude.setValue($event.coords.lng);
  }

}
