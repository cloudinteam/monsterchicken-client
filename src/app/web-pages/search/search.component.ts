import { Component } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Event, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  loading = false;

  constructor(
    private router: Router,
    private headerService: HeaderService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.headerService.disableSearch.next(true);
      }
      if (event instanceof NavigationEnd) {

      }
      if (event instanceof NavigationError) {
      }
    });
  }


}
