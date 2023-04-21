import { HeaderService } from './../../services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from 'src/app/services/cart.service';
import { ProductsListComponent } from 'src/app/web-pages/products-list/products-list.component';
import { MapGeocoder } from '@angular/google-maps';

@Component({
  selector: 'monster-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, AfterViewInit {

  loading = false;
  district = '';
  address = '';
  locationShow = false;

  disableSearch = true;
  searchString: any;
  cartCount = {
    count: 0,
    total: 0
  }

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  // @ViewChild('searchInput', { static: true }) searchInput = {} as ElementRef;

  @ViewChild('loginArea') loginArea!: TemplateRef<any>;
  @ViewChild('cartArea') cartArea!: TemplateRef<any>;
  @ViewChild('locationModal') locationModal!: TemplateRef<any>;
  @ViewChild('locationAllow') locationAllow!: TemplateRef<any>;

  lat: number = 0;
  lng: number = 0;
  mapMarker: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private offcanvasService: NgbOffcanvas,
    private cartService: CartService,
    private ngbModal: NgbModal,
    private geocoder: MapGeocoder,
    private ngZone: NgZone,
  ) {

  }

  ngOnInit(): void {
    this.init();
    this.loading = false;
  }

  ngAfterViewInit() {
    this.handlePermission();
    // let deviceID = MediaDeviceInfo.toJSON();
    // console.log(deviceID)
  }

  init() {
    this.headerService.disableSearch.subscribe((r) => {
      this.disableSearch = r;
    })
    this.headerService.currentAddress.subscribe((r) => {
      this.address = r.address;
      this.district = r.district;
    });
    this.cartService.cartCount.subscribe((r) => {
      this.cartCount.count = r.count;
      this.cartCount.total = r.total;
    })
    this.cartService.getCart({}).subscribe((r: any) => {
      this.cartCount.count = r.response.cart.length;
      this.cartCount.total = r.response.totalCartPrice;
    })
  }

  openLogin() {
    // this.closeCart();
    this.offcanvasService.dismiss(this.cartArea);
    this.offcanvasService.open(this.loginArea, { position: 'end' });
  }

  closeLogin() { // content: TemplateRef<any>
    // console.log('close login');
    this.offcanvasService.dismiss('all')
    this.offcanvasService.dismiss(this.loginArea);
  }

  logout() {
    this.authService.logout();
  }

  trimAddress(address: string) {
    return address.slice(0, 30)+'...';
  }

  launchSearch() {
    this.router.navigate(['search']);
    // this.router.navigateByUrl('/search');
    this.disableSearch = false;
    this.headerService.disableSearch.next(false);
  }

  searchFn() {
    setTimeout(() => {
      this.headerService.searchString.next(this.searchString);
      // console.log(this.searchString);
    }, 1000);
  }

  private searchFilter() {
    fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(500)
      , distinctUntilChanged()
    ).subscribe((searchTerm: string) => {
      this.searchString = searchTerm;
      this.headerService.searchString.next(this.searchString);
    });
  }

  openCart() {
		this.offcanvasService.open(this.cartArea, { position: 'end' });
  }

  closeCart() {
    this.offcanvasService.dismiss(this.cartArea);
    this.loading = true;
    this.cartService.productLoad$.next(true);
    // reLoad(){
      // window.location.reload();
    // }
  }

  home() {
    this.router.navigate(['/']);
  }

  openLocation() {
		this.ngbModal.open(this.locationModal, { fullscreen: false, size: 'xl' });
	}



  // Geo Code ======================================================
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
      let currentAddress = { address: '', district: '' };
      currentAddress.address = results[0].formatted_address;
      results[0].address_components.forEach((address) => {
        if (address.types.includes("administrative_area_level_3") && address.types.includes("political")) {
          currentAddress.district = address.long_name;
        }
      });
      this.address = currentAddress.address;
      this.district = currentAddress.district;
      this.headerService.currentAddress.next(currentAddress);

      this.mapMarker = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };
      this.loading = false;
      this.locationShow = true;
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

}
