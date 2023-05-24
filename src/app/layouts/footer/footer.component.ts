import { Component, Input, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'monster-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentYear: number = new Date().getFullYear();

  @Input() categories: any[] = [];

  loading = false;
  cities: any[] = [];

  constructor(
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.mapService.getActiveCities().subscribe((r: any) => {
      this.cities = r.response.cities;
      this.loading = false;
    })
  }

}
