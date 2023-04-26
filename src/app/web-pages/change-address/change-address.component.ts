import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapGeocoder } from '@angular/google-maps';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressService } from 'src/app/services/address.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'change-address',
  templateUrl: './change-address.component.html',
  styleUrls: ['./change-address.component.scss'],
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
  formattedaddress = ' ';

  submitted = false;
  addressForm!: FormGroup;
  serviceAvailable: boolean = true;
  address: any;

  @Output() backToList: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private ngbModal: NgbModal,
    private geocoder: MapGeocoder,
    private ngZone: NgZone,
    private authService: AuthService,
    private alert: AlertService,
    private addressService: AddressService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.authService.profile({}).subscribe((r: any) => {
      // console.log(r);
      this.addressForm.patchValue({
        number: r.response.userDetail.number,
      });
    });
    this.addressService.updateAddress.subscribe((r) => {
      this.address = r.location;
      if (r.action == 'edit') {
        this.editAddress();
      }
    });
  }

  ngAfterViewInit(): void {
    // this.handlePermission();
  }

  initForm() {
    this.addressForm = this.formBuilder.group({
      userId: [localStorage.getItem('userId'), [Validators.required]],
      area: ['', [Validators.required]],
      streetName: ['', [Validators.required]],
      landMark: [null, [Validators.required]],
      number: [null, [Validators.maxLength(13), Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      district: [null],
      pinCode: [null],
      country: [null],
      type: [null],
      others: [null],
      nickName: [null],
    });
  }
  get addressFormControl(): any {
    return this.addressForm['controls'];
  }

  editAddress() {
    console.log(this.address);
    // this.editAddress = true;

    this.geoCode('address', this.address.area);
    this.addressForm.addControl('addressId', new FormControl(this.address.id, Validators.required));

    this.addressForm.patchValue({
      // addressId: this.address.id,
      area: this.address.area,
      city: this.address.city,
      streetName: this.address.streetName,
      landMark: this.address.landMark,
      nickName: this.address.nickName,
      number: this.address.number,
      pinCode: this.address.pinCode,
      state: this.address.state,
      type: this.address.type,
      others: this.address.others,
    });
  }

  AddressChange(address: any) {
    //setting address from API to local variable
    this.formattedaddress = address.formatted_address;
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
    this.loading = true;
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
      this.addressForm.patchValue({ area: results[0].formatted_address });

      // let currentAddress = { address: '', district: '', show: false };
      results[0].address_components.forEach((address) => {
        if (
          address.types.includes('administrative_area_level_3') &&
          address.types.includes('political')
        ) {
          this.addressForm.patchValue({ district: address.long_name });
        }
        if (
          address.types.includes('administrative_area_level_1') &&
          address.types.includes('political')
        ) {
          this.addressForm.patchValue({ state: address.long_name });
        }
        if (
          address.types.includes('locality') &&
          address.types.includes('political')
        ) {
          this.addressForm.patchValue({ city: address.long_name });
        }
        if (
          address.types.includes('country') &&
          address.types.includes('political')
        ) {
          this.addressForm.patchValue({ country: address.long_name });
        }
        if (address.types.includes('postal_code')) {
          this.addressForm.patchValue({ pinCode: Number(address.long_name) });
        }
      });

      this.mapMarker = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };

      if (this.addressForm.value.pinCode) {
        this.mapService
          .locationCheck({ cityId: this.addressForm.value.city })
          .subscribe((r: any) => {
            // console.log(r);
            if (r.serviceProvider) {
              this.serviceAvailable = true;
              this.alert.fireToastS(r.message[0]);
            }
            if (!r.serviceProvider) {
              this.serviceAvailable = false;
              this.alert.fireToastF(r.message[0]);
            }
          });
      }

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
        this.searchAuto = new google.maps.places.Autocomplete(
          this.searchInput.nativeElement
        );

        this.searchAuto.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: any = this.searchAuto?.getPlace();

            this.lat = place?.geometry?.location?.lat();
            this.lng = place?.geometry?.location?.lat();

            this.mapMarker = {
              lat: place?.geometry?.location?.lat(),
              lng: place?.geometry?.location?.lat(),
            };
            this.geoCode('address', this.searchInput.nativeElement.value);
          });
        });
      }
    }, 1500);
  }

  submit() {
    if (this.addressForm.invalid) {
      this.submitted = true;
    }
    this.addressService
      .storeAdddress(this.addressForm.value)
      .subscribe((r: any) => {
        // console.log(r);
        if (r.status) {
          this.alert.fireToastS(r.message[0]);
          this.backToList.emit();
        }
      });
  }
}
