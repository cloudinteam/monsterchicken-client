import { HeaderService } from './../../services/header.service';
import { Router } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from 'src/app/services/cart.service';
import { MapGeocoder } from '@angular/google-maps';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ProductService } from 'src/app/services/product.service';
import { Category } from 'src/app/models/category.model';
import { MenuItem } from 'primeng/api';
import { ActiveMenuService } from 'src/app/services/active-menu.service';
import { LocalcartService } from 'src/app/services/localcart.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LocationComponent } from 'src/app/web-pages/shared/location/location.component';
import { LocationAllowComponent } from 'src/app/web-pages/shared/location-allow/location-allow.component';


@Component({
  selector: 'monster-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() categories: Category[] = [];

  loading = false;
  district = '';
  address = '';
  locationShow = false;
  logggedIn = false;

  disableSearch = true;
  searchString: any;
  cartCount = {
    count: 0,
    total: 0
  }

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  @ViewChild('loginArea') loginArea!: TemplateRef<any>;
  @ViewChild('cartArea') cartArea!: TemplateRef<any>;
  @ViewChild('profileEdit') profileEdit!: TemplateRef<any>;

  locationModal!: DynamicDialogRef;

  lat: number = 0;
  lng: number = 0;
  mapMarker: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  }

  profileItems: MenuItem[] = [];
  notificationTrigger: any;
  notificationsCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private headerService: HeaderService,
    private offcanvasService: NgbOffcanvas,
    private cartService: CartService,
    private localCartService: LocalcartService,
    private ngbModal: NgbModal,
    private geocoder: MapGeocoder,
    private cdRef: ChangeDetectorRef,
    private activeMenu: ActiveMenuService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {

    this.logggedIn = this.authService.isLoggedIn();

    if (this.logggedIn) {
      this.getNotificationsCount();
      this.notificationTrigger = window.setInterval(() => {
        this.getNotificationsCount();
      }, 300000);
    }

    this.init();

    if (localStorage.getItem("current_address") !== null) {
      let address: any = localStorage.getItem('current_address');
      let currentAddress = JSON.parse(address);

      this.address = currentAddress.address;
      this.district = currentAddress.district;
      this.locationShow = currentAddress.show;
      this.cdRef.markForCheck();
    }

    this.loading = false;

  }

  ngAfterViewInit() {
    if (localStorage.getItem('current_address') == null) {
      this.openLocation();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.notificationTrigger)
  }

  getNotificationsCount() {
    this.headerService.notificationList().subscribe((r: any) => {

      let notifications = r.response.notifications;
      let count = [];

      notifications.forEach((msg: any) => {
        if (msg.is_read == 0) {
          count.push(msg);
        }
      });

      this.notificationsCount = count.length;
    })
  }

  init() {
    this.headerService.disableSearch.subscribe((r) => {
      this.disableSearch = r;
    })

    this.headerService.setBranch.subscribe((r) => {
      if (r.lat != 0 || r.lng != 0) {
        this.mapMarker = {
          lat: r.lat,
          lng: r.lng
        }
        this.geoCode('location');
        // window.location.reload();
      }
    })

    this.headerService.currentAddress.subscribe((r) => {
      this.address = r.address;
      this.district = r.district;
      this.locationShow = r.show;
    });

    this.cartService.cartCount.subscribe((r) => {
      this.cartCount.count = r.count;
      this.cartCount.total = r.total;
    })

    if (this.logggedIn) {
      this.localCartService.pushLocalCartToLive();
      this.cartService.getCart().subscribe((r: any) => {
        this.cartCount.count = r.response.cart.length;
        this.cartCount.total = r.response.totalCartPrice;
      })
    } else {
      this.localCartService.setCartTotal();
    }

    this.profileItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user-edit',
        command: () => {
          this.activeMenu.checkoutMenu.next('profile');
          this.router.navigate(['/account/profile']);
        }
      },
      {
        label: 'My Orders',
        icon: 'pi pi-shopping-bag',
        command: () => {
          this.activeMenu.checkoutMenu.next('order-history');
          this.router.navigate(['/account/order-history']);
        }
      },
      {
        label: 'Saved Address',
        icon: 'pi pi-home',
        command: () => {
          this.router.navigate(['/account/saved-address']);
        }
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.authService.logout();
        }
      }
    ]

    this.headerService.openLogin.subscribe((r) => {
      if (!this.logggedIn && r == true) {
        this.openLogin();
        this.headerService.openLogin.next(false);
      }
    })

  }

  openProfile() {
    this.ngbModal.open(this.profileEdit, { fullscreen: false, size: 'md' });
  }

  closeProfile() {
    this.ngbModal.dismissAll(this.profileEdit);
  }

  openLogin() {
    this.closeCart();
    setTimeout(() => {
      this.offcanvasService.open(this.loginArea, { position: 'end' });
    }, 300);

  }

  closeLogin() {
    this.offcanvasService.dismiss(this.loginArea);
  }

  logout() {
    this.authService.logout();
  }

  trimAddress(address: string) {
    return address.slice(0, 23)+'...';
  }

  launchSearch() {
    this.router.navigate(['search']);
    // this.router.navigateByUrl('/search');
    this.disableSearch = false;
    this.headerService.disableSearch.next(false);
  }

  openCart() {
		// this.offcanvasService.open(this.cartArea, { position: 'end' });
    this.router.navigate(['cart']);
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
    // this.ngbModal.open(this.locationModal, { fullscreen: false, size: 'xl' });

    this.locationModal = this.dialogService.open(LocationComponent, {
      header: 'Enter your location to check service availability.',
      width: '70%',
      // baseZIndex: 1,
      transitionOptions: '100ms',
      contentStyle: { overflow: 'auto' },
      closable: false,
      closeOnEscape: false,
      maximizable: true,
      keepInViewport: true,
      autoZIndex: true,
    })

    this.locationModal.onClose.subscribe( () => {
      this.showAddress();
    });

  }

  showAddress() {
    // this.ngbModal.dismissAll(this.locationModal);
    this.locationShow = true;
    this.cdRef.markForCheck();
  }

  viewCategory(catpanel: OverlayPanel, id: string) {
    catpanel.hide();
    this.router.navigate(['/category/' + id]);
    this.cdRef.markForCheck();
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
      let currentAddress = { address: '', district: '', show: false };
      currentAddress.address = results[0].formatted_address;
      results[0].address_components.forEach((address) => {
        if (address.types.includes("administrative_area_level_3") && address.types.includes("political")) {
          currentAddress.district = address.long_name;
        }
      });
      this.address = currentAddress.address;
      this.district = currentAddress.district;
      currentAddress.show = true;
      this.headerService.currentAddress.next(currentAddress);

      localStorage.setItem('current_address', JSON.stringify(currentAddress));

      this.mapMarker = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };
      this.loading = false;
      this.locationShow = true;

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
    // this.ngbModal.open(this.locationAllow, { centered: true, size: 'md' });
    let locationAllow: DynamicDialogRef;

    locationAllow = this.dialogService.open(LocationAllowComponent, {
      header: '',
      width: '30%',
      // baseZIndex: 1,
      contentStyle: { overflow: 'auto' },
      closable: false,
      closeOnEscape: false,
      maximizable: true,
      keepInViewport: true,
      autoZIndex: true,
    })
    locationAllow.onClose.subscribe( () => {
      this.handlePermission();
    });
  }

  getCoords() {
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
            this.positionDenied()
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
            this.positionDenied()
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
