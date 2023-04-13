import { HeaderService } from './../../services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from 'src/app/services/cart.service';
import { ProductsListComponent } from 'src/app/web-pages/products-list/products-list.component';

@Component({
  selector: 'monster-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, AfterViewInit {

  loading = false;
  district = 'Coimbatore';
  address = '3, Lakshmi Nagar, Velandi Palayam, Coimbatore';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private offcanvasService: NgbOffcanvas,
    private cartService: CartService,
    private ngbModal: NgbModal,
  ) {
    // this.headerService.disableSearch.subscribe((r) => {
    //   this.disableSearch = r;
    // });
    // this.cartService.cartCount.subscribe((r) => {
    //   this.cartCount = r;
    // })
    // this.cartService.getCart({}).subscribe((r: any) => {
    //   this.cartCount = r.response.cart.length;
    //   console.log(this.cartCount)
    // })
    // this.init();
  }

  ngOnInit(): void {
    // this.headerService.disableSearch.subscribe((r) => {
    //   this.disableSearch = r;
    // });
    // this.cartService.getCart({}).subscribe((r: any) => {
    //   this.cartCount = r.response.cart.length;
    // })
    this.init();
    this.loading = false;
  }

  ngAfterViewInit() {
    // console.log(this.searchInput);
    // this.searchFilter();
  }

  init() {
    this.headerService.disableSearch.subscribe((r) => {
      this.disableSearch = r;
    })
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
      console.log(this.searchString);
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
		this.ngbModal.open(this.locationModal, { fullscreen: true });
	}



}
