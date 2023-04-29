import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'url-not-found',
  templateUrl: './url-not-found.component.html',
  styleUrls: ['./url-not-found.component.scss']
})

export class UrlNotFoundComponent  implements OnInit {

  loading = false;

  constructor(
    private router: Router
  ){}

ngOnInit(): void {

}

  bactToHome() {
    this.router.navigate(['/']);
  }

}
