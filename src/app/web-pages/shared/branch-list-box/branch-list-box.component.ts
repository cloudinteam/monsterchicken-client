import { getLocaleEraNames } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'branch-list-box',
  templateUrl: './branch-list-box.component.html',
  styleUrls: ['./branch-list-box.component.scss'],
})
export class BranchListBoxComponent implements OnInit {

    city: any;
    loading = false;

    branches = [
        {
            name: 'Branch Name 1',
            address: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
            phone: 9382054714
        },
        {
            name: 'Branch Name 2',
            address: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
            phone: 9382054714
        },
        {
            name: 'Branch Name 3',
            address: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
            phone: 9382054714
        },
        {
            name: 'Branch Name 4',
            address: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
            phone: 9382054714
        },
    ]

    constructor(
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
    ) {}

    ngOnInit(): void {
        this.loading = true;
        this.city = this.config.data.city;
        this.getBranches(this.city);
        this.loading = false;
    }

    getBranches(city: any) {
        console.log(city);
        this.loading = false;
    }
}
