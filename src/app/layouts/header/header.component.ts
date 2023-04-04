import { HeaderService } from './../../services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
  selector: 'monster-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, AfterViewInit {

  district = 'Coimbatore';
  address = '3, Lakshmi Nagar, Velandi Palayam, Coimbatore';

  disableSearch = true;
  searchString: any;

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  // @ViewChild('searchInput', { static: true }) searchInput = {} as ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService
  ) {
    this.headerService.disableSearch.subscribe((r) => {
      this.disableSearch = r;
    });
  }

  ngOnInit(): void {
    console.log(this.searchInput);
    // console.log(this.route.url);

  }

  ngAfterViewInit() {
    console.log(this.searchInput);
    this.searchFilter();
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
    this.headerService.searchString.next(this.searchString);
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

  home() {
    this.router.navigate(['/']);
  }
}
