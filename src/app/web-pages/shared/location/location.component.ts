import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapGeocoder } from '@angular/google-maps';
import { Loader } from '@googlemaps/js-api-loader';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressComponent } from 'ngx-google-places-autocomplete/objects/addressComponent';
import { ComponentRestrictions } from 'ngx-google-places-autocomplete/objects/options/componentRestrictions';
import { HeaderService } from 'src/app/services/header.service';
import { MapService } from 'src/app/services/map.service';

// declare const google: any;

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  @ViewChild('locationAllow') locationAllow!: TemplateRef<any>;
  @ViewChild('searchInput') searchInput!: ElementRef;
  // @ViewChild('searchInput') searchInput!: GooglePlaceDirective;
  // @ViewChild("placesRef") placesRef: NgxGpAutocompleteDirective;
  // autocompleteInputControl: FormControl = new FormControl<string>('');

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

  display: any;
  zoom = 17;
  geoResult: any;

  searchString: string = '';
  searchAuto: google.maps.places.Autocomplete | undefined;

  formattedaddress = " ";
  postCode!: number;
  city!: string;

AddressChange(address: any) {
  //setting address from API to local variable
  this.formattedaddress=address.formatted_address
}

  constructor(
    private elementRef: ElementRef,
    private ngbModal: NgbModal,
    private httpClient: HttpClient,
    private geocoder: MapGeocoder,
    private ngZone: NgZone,
    private headerService: HeaderService,
    private mapService: MapService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.handlePermission();

    // this.geoCode();
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
    }, 1000);
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
      this.searchString = results[0].formatted_address;
      let currentAddress = { address: '', district: '' };
      results[0].address_components.forEach((address) => {
        if (address.types.includes("administrative_area_level_3") && address.types.includes("political")) {
          currentAddress.district = address.long_name;
        }
        if (address.types.includes("locality") && address.types.includes("political")) {
          this.city = address.long_name;
        }
        if (address.types.includes("postal_code")) {
          this.postCode = Number(address.long_name);
        }
      });
      currentAddress.address = this.searchString;
      this.headerService.currentAddress.next(currentAddress);

      this.mapMarker = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      }
      console.log(this.postCode);
      if (this.postCode) {
        this.mapService.locationCheck({ cityId: this.city }).subscribe( (r: any) => {
          console.log(r);
        })
      }
      this.loading = false;
      // console.log(results); , pinCode: this.postCode, lat: this.mapMarker.lat, lng: this.mapMarker.lng
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
}
