import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  NgZone,
  Output,
  EventEmitter,
} from '@angular/core';
import { MapGeocoder } from '@angular/google-maps';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { AlertService } from 'src/app/services/alert.service';
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

  @Output() showAddress: EventEmitter<any> = new EventEmitter();

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

  errorAlert = false;
  confirmAddress = false;

  optionsPlaces: Options = new Options({
    componentRestrictions: {country: 'IN'}
  })

  // optionsPlaces: Options = {
  //   componentRestrictions: { country: 'IN' },
  //   types: [],
  //   fields: [],
  //   strictBounds: false,
  // }



  constructor(
    private ngbModal: NgbModal,
    private geocoder: MapGeocoder,
    private ngZone: NgZone,
    private headerService: HeaderService,
    private mapService: MapService,
    private alert: AlertService,
  ) {}

  ngOnInit(): void {

  }

  ngAfterViewInit() {


    if (localStorage.getItem('current_address') != null) {
      let address: any = localStorage.getItem('current_address');
      let currentAddress = JSON.parse(address);
      // console.log(currentAddress);
      // this.geoCode('address', currentAddress.address);
      this.setFromLocal();
    } else {
      this.handlePermission();
    }


  }

  addressChange(address: any) {
    //setting address from API to local variable
    this.formattedaddress=address.formatted_address
  }

  searchFn() {
    setTimeout(() => {
      // console.log(this.searchString);
      if (this.searchString != '') {

        this.searchAuto = new google.maps.places.Autocomplete(this.searchInput.nativeElement);

        this.searchAuto.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: any = this.searchAuto?.getPlace();
            console.debug(place);

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

  setFromLocal() {
    if (localStorage.getItem('current_address') != null) {
      let address: any = localStorage.getItem('current_address');
      let currentAddress = JSON.parse(address);

      this.searchString = currentAddress.address;
      this.confirmAddress = true;
    }
    if (localStorage.getItem('current_address') == null) {
      this.getCoords();
    }

    if (localStorage.getItem('lat_lng') != null) {
      let position: any = localStorage.getItem('lat_lng');
      let currentPosition = JSON.parse(position);

      this.mapMarker = currentPosition;
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
      // console.log(results);
      this.geoResult = results[0];
      this.searchString = results[0].formatted_address;
      let currentAddress = { address: '', district: '', show: false };
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
      currentAddress.show = true;
      this.headerService.currentAddress.next(currentAddress);

      localStorage.setItem('current_address', JSON.stringify(currentAddress));


      this.mapMarker = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      }
      // console.log(this.mapMarker);
      localStorage.setItem('lat_lng', JSON.stringify(this.mapMarker));
      // console.log(this.postCode);

      if (this.postCode) {
        this.mapService.locationCheck({ cityId: this.city }).subscribe( (r: any) => {
          // console.log(r);
          if (r.serviceProvider) {
            this.errorAlert = false;
            this.alert.fireToastS(r.message[0])
            // this.showAddress.emit()
            this.confirmAddress = true;
          }
          if (!r.serviceProvider) {
            this.errorAlert = true;
            this.alert.fireToastF(r.message[0])
          }
        })
      }
      this.loading = false;
      // console.log(results); , pinCode: this.postCode, lat: this.mapMarker.lat, lng: this.mapMarker.lng
    });
  }

  handlePermission() {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        this.setFromLocal();
      } else if (result.state === 'prompt') {
        this.setFromLocal();
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

  confirmLocation() {
    this.showAddress.emit();
  }
}
