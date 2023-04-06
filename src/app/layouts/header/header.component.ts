import { HeaderService } from './../../services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from 'src/app/services/cart.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private offcanvasService: NgbOffcanvas,
    private cartService: CartService,
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

  openCart(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' });
  }

  closeCart(content: TemplateRef<any>) {
    this.offcanvasService.dismiss(content);
    this.loading = true;
    // reLoad(){
      window.location.reload();
    // }
  }

  home() {
    this.router.navigate(['/']);
  }
}
