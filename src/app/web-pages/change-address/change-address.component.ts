import { AfterViewInit, Component, ElementRef, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MapGeocoder } from '@angular/google-maps';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'change-address',
  templateUrl: './change-address.component.html',
  styleUrls: ['./change-address.component.scss']
})
export class ChangeAddressComponent implements OnInit, AfterViewInit {

  @ViewChild('locationAllow') locationAllow!: TemplateRef<any>;
  @ViewChild('searchInput') searchInput!: ElementRef;

  loading = false;

  lat: number = 0;
  lng: number = 0;
  mapMarker: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
  };
  zoom = 17;
  geoResult: any;
  display: any;

  searchString: string = '';
  searchAuto: google.maps.places.Autocomplete | undefined;
  formattedaddress=" ";

  constructor(
    private elementRef: ElementRef,
    private ngbModal: NgbModal,
    private geocoder: MapGeocoder,
    private ngZone: NgZone
  ) {


  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.handlePermission();
  }

  AddressChange(address: any) {
    //setting address from API to local variable
    this.formattedaddress=address.formatted_address
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      // console.log(event.latLng.toJSON());
      this.mapMarker = event.latLng.toJSON();
      this.geoCode();
    }
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.display = event.latLng.toJSON();
    }
  }

  geoCode(type: string = 'location', address: string = '') {
    // this.loading = true;
    let data = {};
    if (type == 'location') {
      data = {
        location: this.mapMarker,
      };
    }

    if (type == 'address') {
      data = {
        address: address,
      };
    }

    this.geocoder.geocode(data).subscribe(({ results }) => {
      this.geoResult = results[0];

      this.mapMarker = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };
      this.loading = false;
      // console.log(results);
    });
  }

  handlePermission() {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        this.getCoords();
      } else if (result.state === 'prompt') {
        this.getCoords();
      } else if (result.state === 'denied') {
        this.positionDenied();
      }
      result.addEventListener('change', () => {
        console.log(result.state);
      });
    });
  }

  closeBlocker() {
    this.ngbModal.dismissAll();
    this.handlePermission();
  }

  positionDenied() {
    this.ngbModal.open(this.locationAllow, { centered: true, size: 'md' });
  }

  getCoords() {
    console.log('getCoords Called');
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        navigator.geolocation.getCurrentPosition(
          (position: any) => {
            if (position) {
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;
              this.mapMarker = {
                lat: this.lat,
                lng: this.lng,
              };
              this.geoCode();
            }
          },
          () => {
            this.ngbModal.open(this.locationAllow, {
              centered: true,
              size: 'md',
            });
          }
        );
      } else if (result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          (position: any) => {
            if (position) {
              this.lat = position.coords.latitude;
              this.lng = position.coords.longitude;
              this.mapMarker = {
                lat: this.lat,
                lng: this.lng,
              };
              this.geoCode();
            }
          },
          () => {
            this.ngbModal.open(this.locationAllow, {
              centered: true,
              size: 'md',
            });
          }
        );
      } else if (result.state === 'denied') {
        this.positionDenied();
      }
      result.addEventListener('change', () => {
        console.log(result.state);
      });
    });
  }

  searchFn() {
    setTimeout(() => {
      // console.log(this.searchString);
      if (this.searchString != '') {

        this.searchAuto = new google.maps.places.Autocomplete(this.searchInput.nativeElement);

        this.searchAuto.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: any = this.searchAuto?.getPlace();

            this.lat = place?.geometry?.location?.lat()
            this.lng = place?.geometry?.location?.lat()

            this.mapMarker = {
              lat: place?.geometry?.location?.lat(),
              lng: place?.geometry?.location?.lat(),
            }
            this.geoCode('address', this.searchInput.nativeElement.value);
          })
        })

      }
    }, 1500);
  }

}
