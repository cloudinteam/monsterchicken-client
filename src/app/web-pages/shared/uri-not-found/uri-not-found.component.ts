import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-uri-not-found',
  templateUrl: './uri-not-found.component.html',
  styleUrls: ['./uri-not-found.component.scss'],
})
export class UriNotFoundComponent implements OnInit {

  loading = true;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
    }, 100)

    // this.loading = false;
  }

  bactToHome() {
    this.router.navigate(['/']);
  }
}
