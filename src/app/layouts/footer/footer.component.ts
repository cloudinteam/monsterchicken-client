import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MapService } from 'src/app/services/map.service';
import { BranchListBoxComponent } from 'src/app/web-pages/shared/branch-list-box/branch-list-box.component';

@Component({
  selector: 'monster-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  @Input() categories: any[] = [];

  loading = false;
  cities: any[] = [];
  visible = false;

  constructor(
    private mapService: MapService,
    public dialogService: DialogService,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.mapService.getActiveCities().subscribe((r: any) => {
        this.cities = r.response.districts;
        this.loading = false;
    });
  }

  getBranch(city: any) {
    // console.log(city);
    let ref: DynamicDialogRef;
    ref = this.dialogService.open(BranchListBoxComponent, {
        data: {
            city: city,
        },
        header: city.district + ' Branches',
        width: '80%',
        contentStyle: { overflow: 'auto' },
    });

    ref.onClose.subscribe(() => {});
  }

  showAppdialog() {
    this.visible = true;
  }
}
