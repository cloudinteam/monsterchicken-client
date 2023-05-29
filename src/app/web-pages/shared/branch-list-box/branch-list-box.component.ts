import { getLocaleEraNames } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HeaderService } from 'src/app/services/header.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'branch-list-box',
  templateUrl: './branch-list-box.component.html',
  styleUrls: ['./branch-list-box.component.scss'],
})
export class BranchListBoxComponent implements OnInit {
  city: any;
  loading = false;

  branches: any[] = [];

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private productService: ProductService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.city = this.config.data.city;
    this.getBranches(this.city);
    // this.loading = false;
  }

  getBranches(city: any) {
    this.productService.getBranches(Number(city.pincode)).subscribe((r: any) => {
      this.branches = r.response.branches;
      this.loading = false;
    });
  }

  setLocation(branch: any) {
    this.headerService.setBranch.next({
      lat: branch.latitude,
      lng: branch.longitude,
    });

    localStorage.setItem(
      'lat_lng',
      JSON.stringify({ lat: branch.latitude, lng: branch.longitude })
    );
    localStorage.setItem('userLat', JSON.stringify(branch.latitude));
    localStorage.setItem('userLong', JSON.stringify(branch.longitude));
    this.ref.close();
  }
}
